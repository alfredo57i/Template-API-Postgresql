import { Controller, Get, Post, Body, UseGuards, Req, Patch, Param, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateUserWithProfileDto } from './dto/create-user.dto';
import { AssignPermissionsDto, UpdateNameDto, UpdatePhotoDto } from './dto/update-profile.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { UserPublicDto } from './dto/user-public.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() body: CreateUserWithProfileDto) {
    return this.usersService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile/name')
  updateName(@Req() req, @Body() dto: UpdateNameDto) {
    return this.usersService.updateFullName(req.user.id, dto.fullName);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile/photo')
  updatePhoto(@Req() req, @Body() dto: UpdatePhotoDto) {
    return this.usersService.updateProfileImage(req.user.id, dto.profileImageUrl);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-permissions'), PermissionsGuard)
  @Permissions('view_users')
  @Get('all')
  @ApiOkResponse({ type: [UserPublicDto] })
  getSecret(@Req() req) {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/permissions')
  async assignPermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignPermissionsDto
  ) {
    return this.usersService.assignPermissions(id, dto.permissions);
  }

}
