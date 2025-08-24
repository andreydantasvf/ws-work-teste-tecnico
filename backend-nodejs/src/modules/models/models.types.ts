export interface IModel {
  id?: number;
  name: string;
  fipeValue: number;
  brandId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IModelRepository {
  save(model: IModel): Promise<IModel>;
  findAll(): Promise<IModel[]>;
  findById(id: number): Promise<IModel | null>;
  findByName(name: string): Promise<IModel | null>;
  update(id: number, model: IModel): Promise<IModel | null>;
  delete(id: number): Promise<boolean>;
}
