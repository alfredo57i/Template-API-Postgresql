import { ArrayNotEmpty, IsArray, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateNameDto {
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  fullName: string;
}

export class UpdatePhotoDto {
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  profileImageUrl: string;
}

export class AssignPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[];
}