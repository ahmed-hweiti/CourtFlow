import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface CreateBookingData {
  courtId: number;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  startTime: string;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.booking.findMany({
      include: { court: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateBookingData) {
    const court = await this.prisma.court.findUnique({ where: { id: data.courtId } });

    if (!court) {
      throw new NotFoundException(`Court with ID ${data.courtId} not found`);
    }

    if (!court.available) {
      throw new BadRequestException(`Court with ID ${data.courtId} is not available`);
    }

    const bookingDate = new Date(data.bookingDate);

    const existingBooking = await this.prisma.booking.findUnique({
      where: {
        courtId_bookingDate_startTime: {
          courtId: data.courtId,
          bookingDate,
          startTime: data.startTime,
        },
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        `Court with ID ${data.courtId} is already booked on ${data.bookingDate} at ${data.startTime}`,
      );
    }

    return this.prisma.booking.create({
      data: {
        courtId: data.courtId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        bookingDate,
        startTime: data.startTime,
      },
      include: { court: true },
    });
  }

  async remove(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    await this.prisma.booking.delete({ where: { id } });
    return { message: `Booking with ID ${id} was cancelled` };
  }
}