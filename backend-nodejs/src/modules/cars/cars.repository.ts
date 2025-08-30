import { type PrismaClient } from '@prisma/client';
import { type ICar, type ICarRepository, type ICarsFilter } from './cars.types';
import { DatabaseConnection } from '@/core/database/connection';
import { AppError } from '@/core/webserver/app-error';

export class CarsRepository implements ICarRepository {
  private db: PrismaClient;

  constructor() {
    this.db = DatabaseConnection.getInstance().getClient();
  }

  async save(car: ICar): Promise<ICar> {
    try {
      const createdCar = await this.db.cars.create({
        data: car,
        include: {
          model: {
            include: {
              brand: true
            }
          }
        }
      });
      return createdCar;
    } catch (error) {
      throw new AppError(`Error saving car to database: ${error}`, 500);
    }
  }

  async findAll(): Promise<ICar[]> {
    try {
      const cars = await this.db.cars.findMany({
        include: {
          model: {
            include: {
              brand: true
            }
          }
        }
      });
      return cars;
    } catch (error) {
      throw new AppError(`Error fetching all cars: ${error}`, 500);
    }
  }

  async findById(id: number): Promise<ICar | null> {
    try {
      const car = await this.db.cars.findUnique({
        where: { id },
        include: {
          model: {
            include: {
              brand: true
            }
          }
        }
      });
      return car;
    } catch (error) {
      throw new AppError(`Error fetching car by ID: ${error}`, 500);
    }
  }

  async update(id: number, car: ICar): Promise<ICar | null> {
    try {
      const updatedCar = await this.db.cars.update({
        where: { id },
        data: car,
        include: {
          model: {
            include: {
              brand: true
            }
          }
        }
      });
      return updatedCar;
    } catch (error) {
      throw new AppError(`Error updating car: ${error}`, 500);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.cars.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      throw new AppError(`Error deleting car: ${error}`, 500);
    }
  }

  async findWithFilters(filters: ICarsFilter): Promise<ICar[]> {
    try {
      const {
        color,
        year,
        yearGte,
        yearLte,
        fuel,
        numberOfPorts,
        value,
        valueGte,
        valueLte,
        modelId,
        brandName,
        sortBy = 'id',
        order = 'asc',
        page = 1,
        limit = 50
      } = filters;

      const whereConditions = [];

      if (color)
        whereConditions.push({
          color: { contains: color, mode: 'insensitive' }
        });
      if (year) whereConditions.push({ year });
      if (yearGte && yearLte) {
        whereConditions.push({ year: { gte: yearGte, lte: yearLte } });
      } else if (yearGte) {
        whereConditions.push({ year: { gte: yearGte } });
      } else if (yearLte) {
        whereConditions.push({ year: { lte: yearLte } });
      }
      if (fuel)
        whereConditions.push({ fuel: { contains: fuel, mode: 'insensitive' } });
      if (numberOfPorts) whereConditions.push({ numberOfPorts });
      if (value) whereConditions.push({ value });
      if (valueGte && valueLte) {
        whereConditions.push({ value: { gte: valueGte, lte: valueLte } });
      } else if (valueGte) {
        whereConditions.push({ value: { gte: valueGte } });
      } else if (valueLte) {
        whereConditions.push({ value: { lte: valueLte } });
      }
      if (modelId) whereConditions.push({ modelId });
      if (brandName) {
        whereConditions.push({
          model: {
            brand: {
              name: { contains: brandName, mode: 'insensitive' }
            }
          }
        });
      }

      const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

      let orderBy = {};
      if (sortBy === 'year') {
        orderBy = { year: order };
      } else if (sortBy === 'color') {
        orderBy = { color: order };
      } else if (sortBy === 'fuel') {
        orderBy = { fuel: order };
      } else if (sortBy === 'numberOfPorts') {
        orderBy = { numberOfPorts: order };
      } else if (sortBy === 'value') {
        orderBy = { value: order };
      } else {
        orderBy = { id: order };
      }

      const skip = (page - 1) * limit;

      const cars = await this.db.cars.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          model: {
            include: {
              brand: true
            }
          }
        }
      });

      return cars;
    } catch (error) {
      throw new AppError(`Error fetching cars with filters: ${error}`, 500);
    }
  }
}
