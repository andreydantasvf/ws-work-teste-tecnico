export interface ICar {
  id?: number;
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  modelId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICarRepository {
  save(car: ICar): Promise<ICar>;
  findById(id: number): Promise<ICar | null>;
  findAll(): Promise<ICar[]>;
  update(id: number, car: ICar): Promise<ICar | null>;
  delete(id: number): Promise<boolean>;
}
