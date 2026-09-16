import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  AuthService,
  type LoginInput,
  type RegisterInput,
} from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterInput) {
    // Keep the controller thin: normalization and validation live in the service.
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginInput) {
    // Thin controller: verification, hash-stripping, and the generic 401 all
    // live in the service.
    return this.authService.login(body);
  }
}
