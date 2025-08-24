import { type FastifyReply, type FastifyRequest } from 'fastify';
import { BrandsService } from './brands.service';
import { IBrand } from './brands.types';

export class BrandsController {
  private brandsService: BrandsService;

  constructor() {
    this.brandsService = new BrandsService();
  }

  public async createBrand(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { name } = request.body as IBrand;
    const newBrand = await this.brandsService.createBrand({ name });
    reply.status(201).send({
      success: true,
      data: newBrand
    });
  }

  public async getAllBrands(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const brands = await this.brandsService.getAllBrands();
    reply.status(200).send({
      success: true,
      data: brands
    });
  }

  public async getBrandById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    const brand = await this.brandsService.getBrandById(id);
    reply.status(200).send({
      success: true,
      data: brand
    });
  }

  public async updateBrand(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    const { name } = request.body as IBrand;
    const updatedBrand = await this.brandsService.updateBrand(id, { name });
    reply.status(200).send({
      success: true,
      data: updatedBrand
    });
  }

  public async deleteBrand(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    await this.brandsService.deleteBrand(id);
    reply.status(200).send({ success: true, data: null });
  }

  public async getModelsByBrandId(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    const models = await this.brandsService.getModelsByBrandId(id);
    reply.status(200).send({
      success: true,
      data: models
    });
  }
}
