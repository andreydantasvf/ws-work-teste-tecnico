export interface IBrand {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBrandRepository {
  save(brand: IBrand): Promise<IBrand>;
  findById(id: number): Promise<IBrand | null>;
  findByName(name: string): Promise<IBrand | null>;
  findAll(): Promise<IBrand[]>;
  update(id: number, brand: IBrand): Promise<IBrand | null>;
  delete(id: number): Promise<boolean>;
}
