import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, role } = await this.authService.login(loginDto);
    res.cookie('access_token', token, { httpOnly: true });
    return { token, role };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Déconnexion réussie' };
  }
}