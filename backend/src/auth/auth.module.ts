import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

// The signing secret must come from the environment, never from code. If it
// is missing we fail loudly at bootstrap instead of silently signing tokens
// with an insecure fallback, so a misconfigured deploy is obvious immediately.
if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not set. Configure it in the environment (see .env.example).',
  );
}

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
