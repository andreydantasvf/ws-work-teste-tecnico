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
  ): Promise<IBrand> {
    const { name } = request.body as IBrand;
    const newBrand = await this.brandsService.createBrand({ name });
    return reply.status(201).send({
      success: true,
      data: newBrand
    });
  }

  public async getAllBrands(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<IBrand[]> {
    const brands = await this.brandsService.getAllBrands();
    return reply.status(200).send({
      success: true,
      data: brands
    });
  }

  public async getBrandById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<IBrand> {
    const { id } = request.params as { id: number };
    const brand = await this.brandsService.getBrandById(id);
    return reply.status(200).send({
      success: true,
      data: brand
    });
  }

  public async updateBrand(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<IBrand> {
    const { id } = request.params as { id: number };
    const { name } = request.body as IBrand;
    const updatedBrand = await this.brandsService.updateBrand(id, { name });
    return reply.status(200).send({
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
    return reply.status(200).send({ success: true, data: null });
  }
}
