import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserWithProfileDto } from './dto/create-user.dto';
import { UserProfile } from './entities/user-profile.entity';
import { Permission } from 'src/users/entities/permission.entity';
import { UserPublicDto } from './dto/user-public.dto';

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

  async create(dto: CreateUserWithProfileDto): Promise<UserPublicDto> {
    const { email, password, role = UserRole.CLIENT, profile } = dto;
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      id,
      email,
      password: hashedPassword,
      role,
      isActive: false,
    });
    const userProfile = this.profileRepository.create({
      id, // 👈 mismo UUID que user
      ...profile,
      user,
    });
    user.profile = userProfile;
    const saved = await this.userRepository.save(user);
    return {
      id: saved.id,
      email: saved.email,
      isActive: saved.isActive,
      role: saved.role,
    };
  }


  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
      relations: ['profile'],
    });
  }


  async findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'role'],
      relations: ['profile'],
    });
  }


  async updateFullName(userId: string, fullName: string) {
    const user = await this.findById(userId);
    if (!user?.profile) throw new NotFoundException('Usuario no encontrado');
    user.profile.fullName = fullName;
    await this.profileRepository.save(user.profile);
    return { message: 'Nombre actualizado correctamente' };
  }


  async updateProfileImage(userId: string, imageUrl: string) {
    const user = await this.findById(userId);
    if (!user?.profile) throw new NotFoundException('Usuario no encontrado');
    user.profile.profileImageUrl = imageUrl;
    await this.profileRepository.save(user.profile);
    return { message: 'Imagen de perfil actualizada correctamente' };
  }


  async findAll() {
    return this.userRepository.find();
  }

  async assignPermissions(userId: string, permissionNames: string[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    const permissions = await this.permissionRepository.findBy({
      name: In(permissionNames),
    });
    if (permissions.length !== permissionNames.length) {
      throw new BadRequestException('Uno o más permisos no existen.');
    }
    user.permissions = permissions;
    await this.userRepository.save(user);
    return { message: 'Permisos actualizados correctamente.' };
  }

}
