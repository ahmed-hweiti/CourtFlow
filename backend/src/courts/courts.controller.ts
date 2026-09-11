import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { CourtsService } from './courts.service.js';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Get()
  findAll() {
    return this.courtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const court = this.courtsService.findOne(id);
    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }
    return court;
  }
}
