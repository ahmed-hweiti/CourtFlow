import { Injectable } from '@nestjs/common';
import type { Court } from './court.interface.js';

@Injectable()
export class CourtsService {
  private readonly courts: Court[] = [
    {
      id: 1,
      name: 'Abdoun Football Ground',
      sport: 'Football',
      location: 'Abdoun, Amman',
      pricePerHour: 25,
      available: true,
    },
    {
      id: 2,
      name: 'Tlaa Al Ali Padel Arena',
      sport: 'Padel',
      location: 'Tlaa Al Ali, Amman',
      pricePerHour: 20,
      available: true,
    },
    {
      id: 3,
      name: 'Sports City Basketball Court',
      sport: 'Basketball',
      location: 'Al Hussein Sports City, Amman',
      pricePerHour: 15,
      available: false,
    },
    {
      id: 4,
      name: 'Al Shmesani Tennis Club',
      sport: 'Tennis',
      location: 'Al Shmesani, Amman',
      pricePerHour: 30,
      available: true,
    },
    {
      id: 5,
      name: 'Sweifieh Indoor Football Hall',
      sport: 'Football',
      location: 'Sweifieh, Amman',
      pricePerHour: 28,
      available: false,
    },
    {
      id: 6,
      name: 'Al Weibdeh Community Padel Court',
      sport: 'Padel',
      location: 'Al Weibdeh, Amman',
      pricePerHour: 18,
      available: true,
    },
  ];

  findAll(): Court[] {
    return this.courts;
  }

  findOne(id: number): Court | undefined {
    return this.courts.find((court) => court.id === id);
  }
}
