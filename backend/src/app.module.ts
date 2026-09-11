import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CourtsModule } from './courts/courts.module.js';

@Module({
  imports: [CourtsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
