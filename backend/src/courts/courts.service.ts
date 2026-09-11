import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.court.findMany({ orderBy: { id: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.court.findUnique({ where: { id } });
  }
}