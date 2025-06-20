import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    const auth = await this.authService.login(user);
    return {user: user.profile, ...auth};
  }
x
  @Auth({strategy: 'jwt-refresh'})
  @Post('refresh')
  async refresh(@Req() req) {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    return this.authService.refreshTokens(req.user.id, refreshToken);
  }

  @Auth()
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

}
