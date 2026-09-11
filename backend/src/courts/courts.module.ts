import { Module } from '@nestjs/common';
import { CourtsController } from './courts.controller.js';
import { CourtsService } from './courts.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CourtsController],
  providers: [CourtsService],
})
export class CourtsModule {}