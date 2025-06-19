import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';
import { Type } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class CreateUserWithProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;
}