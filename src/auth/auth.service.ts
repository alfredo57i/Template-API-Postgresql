import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(

    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private usersService: UsersService,
    private jwt: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, profile: user.profile };
    const access_token = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.TOKEN_EXPIRED,
    });
    const refresh_token = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRED,
    });
    await this.saveRefreshToken(user.id, refresh_token, process.env.REFRESH_EXPIRED || '7d');
    return { access_token, refresh_token };
  }


  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('Acceso denegado');
    // Buscar los tokens del usuario
    const storedTokens = await this.refreshTokenRepo.find({
      where: { user: { id: userId } },
    });
    // Verificar si el token coincide con alguno
    const matchedToken = await Promise.any(
      storedTokens.map(async (stored) => {
        const match = await bcrypt.compare(refreshToken, stored.token);
        return match ? stored : Promise.reject();
      })
    ).catch(() => null);

    if (!matchedToken) {
      throw new ForbiddenException('Refresh token inválido');
    }
    // Eliminar el token usado (rotación de token)
    await this.refreshTokenRepo.delete({ id: matchedToken.id });
    const payload = { email: user.email, sub: user.id, role: user.role, profile: user.profile };
    const newAccessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.TOKEN_EXPIRED,
    });
    const newRefreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRED,
    });
    // Guardar nuevo token
    const expiresAt = new Date(
      Date.now() + ms(process.env.REFRESH_EXPIRED || '7d')
    );
    const hashedToken = await bcrypt.hash(newRefreshToken, 10);
    await this.refreshTokenRepo.save({
      token: hashedToken,
      expiresAt,
      user,
    });
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }


  async logout(userId: number) {
    await this.refreshTokenRepo.delete({ user: { id: userId } });
    return { message: 'Sesión cerrada en todos los dispositivos' };
  }


  async saveRefreshToken(userId: number, token: string, expiresIn: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const expiresAt = new Date(Date.now() + ms(expiresIn));
    const hashedToken = await bcrypt.hash(token, 10);
    const entity = this.refreshTokenRepo.create({
      token: hashedToken,
      expiresAt,
      user: user,
    });

    return this.refreshTokenRepo.save(entity);
  }

}