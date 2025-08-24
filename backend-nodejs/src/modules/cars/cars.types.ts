export interface ICar {
  id?: number;
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  modelId: number;
  createdAt?: Date;
  updatedAt?: Date;
  model?: {
    name: string;
    brand?: { name: string };
  };
}

export interface ICarsFilter {
  color?: string;
  year?: number;
  yearGte?: number;
  yearLte?: number;
  fuel?: string;
  numberOfPorts?: number;
  modelId?: number;
  brandName?: string;
  sortBy?: 'year' | 'color' | 'fuel' | 'numberOfPorts';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ICarRepository {
  save(car: ICar): Promise<ICar>;
  findById(id: number): Promise<ICar | null>;
  findAll(): Promise<ICar[]>;
  findWithFilters(filters: ICarsFilter): Promise<ICar[]>;
  update(id: number, car: ICar): Promise<ICar | null>;
  delete(id: number): Promise<boolean>;
}
