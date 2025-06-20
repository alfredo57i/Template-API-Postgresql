import { Controller, Get, Post, Body, Req, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserWithProfileDto } from './dto/create-user.dto';
import { AssignPermissionsDto, UpdateNameDto, UpdatePhotoDto } from './dto/update-profile.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() body: CreateUserWithProfileDto) {
    return this.usersService.create(body);
  }

  @Auth()
  @Patch('profile/name')
  updateName(@Req() req, @Body() dto: UpdateNameDto) {
    return this.usersService.updateFullName(req.user.id, dto.fullName);
  }

  @Auth()
  @Patch('profile/photo')
  updatePhoto(@Req() req, @Body() dto: UpdatePhotoDto) {
    return this.usersService.updateProfileImage(req.user.id, dto.profileImageUrl);
  }

  @Auth({ permissions: ['view_users'] })
  @Get('all')
  getUsers() {
    return this.usersService.findAll();
  }

  @Auth({ roles: [UserRole.ADMIN] })
  @Patch(':id/permissions')
  assignPermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignPermissionsDto
  ) {
    return this.usersService.assignPermissions(id, dto.permissions);
  }

}
