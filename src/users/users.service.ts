import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserWithProfileDto } from './dto/create-user.dto';
import { UserProfile } from './entities/user-profile.entity';
import { Permission } from 'src/users/entities/permission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) { }

  async create(dto: CreateUserWithProfileDto) {
    const { email, password, role = UserRole.CLIENT, profile } = dto;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      profile,
    });
    return this.userRepository.save(user);
  }


  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
      relations: ['profile'],
    });
  }


  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'role'],
      relations: ['profile'],
    });
  }


  async updateFullName(userId: number, fullName: string) {
    const user = await this.findById(userId);
    if (!user?.profile) throw new NotFoundException('Usuario no encontrado');
    user.profile.fullName = fullName;
    await this.profileRepository.save(user.profile);
    return { message: 'Nombre actualizado correctamente' };
  }


  async updateProfileImage(userId: number, imageUrl: string) {
    const user = await this.findById(userId);
    if (!user?.profile) throw new NotFoundException('Usuario no encontrado');
    user.profile.profileImageUrl = imageUrl;
    await this.profileRepository.save(user.profile);
    return { message: 'Imagen de perfil actualizada correctamente' };
  }


  async findAll() {
    return this.userRepository.find();
  }

  async assignPermissions(userId: number, permissionNames: string[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const permissions = await this.permissionRepository.findBy({
      name: In(permissionNames),
    });
    if (permissions.length !== permissionNames.length) {
      throw new BadRequestException('Uno o más permisos no existen');
    }
    user.permissions = permissions;
    await this.userRepository.save(user);
    return { message: 'Permisos actualizados correctamente.' };
  }

}
