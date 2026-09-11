import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CourtsModule } from './courts/courts.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

@Module({
  imports: [CourtsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
