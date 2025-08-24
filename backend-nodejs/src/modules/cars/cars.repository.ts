import { type PrismaClient } from '@prisma/client';
import { type ICar, type ICarRepository } from './cars.types';
import { DatabaseConnection } from '@/core/database/connection';
import { AppError } from '@/core/webserver/app-error';

export class CarsRepository implements ICarRepository {
  private db: PrismaClient;

  constructor() {
    this.db = DatabaseConnection.getInstance().getClient();
  }

  async save(car: ICar): Promise<ICar> {
    try {
      const createdCar = await this.db.car.create({
        data: car
      });
      return createdCar;
    } catch (error) {
      throw new AppError(`Error saving car to database: ${error}`, 500);
    }
  }

  async findAll(): Promise<ICar[]> {
    try {
      const cars = await this.db.car.findMany();
      return cars;
    } catch (error) {
      throw new AppError(`Error fetching all cars: ${error}`, 500);
    }
  }

  async findById(id: number): Promise<ICar | null> {
    try {
      const car = await this.db.car.findUnique({
        where: { id }
      });
      return car;
    } catch (error) {
      throw new AppError(`Error fetching car by ID: ${error}`, 500);
    }
  }

  async update(id: number, car: ICar): Promise<ICar | null> {
    try {
      const updatedCar = await this.db.car.update({
        where: { id },
        data: car
      });
      return updatedCar;
    } catch (error) {
      throw new AppError(`Error updating car: ${error}`, 500);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.car.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      throw new AppError(`Error deleting car: ${error}`, 500);
    }
  }
}
