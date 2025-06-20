import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Roles } from './roles.decorator';
import { Permissions } from './permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';

interface AuthOptions {
  roles?: UserRole[];
  permissions?: string[];
  strategy?: string;
  swaggerAuth?: boolean;
}

export function Auth(options: AuthOptions = {}) {
  const decorators: Array<ClassDecorator | MethodDecorator> = [];

  if (options.swaggerAuth !== false) {
    decorators.push(ApiBearerAuth());
  }

  const strategy = options.strategy || (options.permissions ? 'jwt-permissions' : 'jwt');
  decorators.push(UseGuards(AuthGuard(strategy)));

  if (options.roles) {
    decorators.push(Roles(...options.roles));
    decorators.push(UseGuards(RolesGuard));
  }

  if (options.permissions) {
    decorators.push(Permissions(...options.permissions));
    decorators.push(UseGuards(PermissionsGuard));
  }

  return applyDecorators(...decorators);
}
