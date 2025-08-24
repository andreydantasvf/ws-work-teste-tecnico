import { AppError } from '@/core/webserver/app-error';
import { CarsRepository } from './cars.repository';
import { type ICar, type ICarRepository } from './cars.types';

export class CarsService {
  private repository: ICarRepository;

  constructor() {
    this.repository = new CarsRepository();
  }

  public async createCar(car: ICar): Promise<ICar> {
    return this.repository.save(car);
  }

  public async getAllCars(): Promise<ICar[]> {
    return this.repository.findAll();
  }

  public async getCarById(id: number): Promise<ICar | null> {
    const car = await this.repository.findById(id);
    if (!car) {
      throw new AppError('Carro não existe', 404);
    }
    return car;
  }

  public async updateCar(id: number, car: ICar): Promise<ICar | null> {
    const existingCar = await this.repository.findById(id);
    if (!existingCar) {
      throw new AppError('Carro não existe', 404);
    }
    return this.repository.update(id, car);
  }

  public async deleteCar(id: number): Promise<void> {
    const existingCar = await this.repository.findById(id);
    if (!existingCar) {
      throw new AppError('Carro não existe', 404);
    }
    await this.repository.delete(id);
  }
}
