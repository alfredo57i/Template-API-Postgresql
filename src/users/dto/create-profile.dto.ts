import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  profileImageUrl?: string;

}