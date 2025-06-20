import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtPermissionsStrategy extends PassportStrategy(Strategy, 'jwt-permissions') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['permissions'],
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if(!user.isActive){
      throw new UnauthorizedException('Usuario inactivo, contacta a soporte.')
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions.map(p => p.name),
    };
  }
}