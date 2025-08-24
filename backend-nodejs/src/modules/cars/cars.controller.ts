import { FastifyReply, FastifyRequest } from 'fastify';
import { CarsService } from './cars.service';
import { ICar, ICarsFilter } from './cars.types';

export class CarsController {
  private carsService: CarsService;

  constructor() {
    this.carsService = new CarsService();
  }

  public async createCar(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const car = request.body as ICar;
    const newCar = await this.carsService.createCar(car);
    reply.status(201).send({
      success: true,
      data: newCar
    });
  }

  public async getAllCars(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const filters = request.query as ICarsFilter;

    if (Object.keys(filters).length > 0) {
      const cars = await this.carsService.getCarsWithFilters(filters);
      reply.send({
        success: true,
        data: cars
      });
    } else {
      const cars = await this.carsService.getAllCars();
      reply.send({
        success: true,
        data: cars
      });
    }
  }

  public async getCarById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    const car = await this.carsService.getCarById(id);
    reply.send({
      success: true,
      data: car
    });
  }

  public async updateCar(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    const carData = request.body as ICar;
    const updatedCar = await this.carsService.updateCar(id, carData);
    reply.send({
      success: true,
      data: updatedCar
    });
  }

  public async deleteCar(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    await this.carsService.deleteCar(id);
    reply.send({
      success: true,
      data: null
    });
  }
}
