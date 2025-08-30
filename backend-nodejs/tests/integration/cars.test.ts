import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { createTestApp, closeTestApp } from '../helpers/app.helper';
import { prisma } from '../setup';

interface CarResponse {
  id: number;
  color: string;
  year: number;
  numberOfPorts: number;
  fuel: string;
  value: number;
  modelId: number;
  model: {
    brand: {
      name: string;
    };
  };
}

describe('Cars Endpoints Integration Tests', () => {
  let app: FastifyInstance;
  let testBrand: { id: number; name: string };
  let testModel: {
    id: number;
    name: string;
    brandId: number;
    fipeValue: number;
  };

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    testBrand = await prisma.brand.create({
      data: { name: 'Test Brand Cars' }
    });

    testModel = await prisma.model.create({
      data: {
        name: 'Test Model Cars',
        brandId: testBrand.id,
        fipeValue: 50000
      }
    });
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /api/cars', () => {
    it('deve retornar array vazio quando não há carros', async () => {
      const response = await request(app.server).get('/api/cars').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: []
      });
    });

    it('deve retornar todos os carros cadastrados', async () => {
      await prisma.cars.createMany({
        data: [
          {
            color: 'Vermelho',
            year: 2020,
            numberOfPorts: 4,
            fuel: 'Gasolina',
            value: 45000.5,
            modelId: testModel.id
          },
          {
            color: 'Azul',
            year: 2021,
            numberOfPorts: 2,
            fuel: 'Etanol',
            value: 38000.0,
            modelId: testModel.id
          },
          {
            color: 'Preto',
            year: 2019,
            numberOfPorts: 4,
            fuel: 'Flex',
            value: 42000.75,
            modelId: testModel.id
          }
        ]
      });

      const response = await request(app.server).get('/api/cars').expect(200);

      expect(response.body.data).toHaveLength(3);
      const carColors = response.body.data.map(
        (c: { color: string }) => c.color
      );
      expect(carColors).toContain('Vermelho');
      expect(carColors).toContain('Azul');
      expect(carColors).toContain('Preto');
    });

    it('deve retornar carros com estrutura correta', async () => {
      await prisma.cars.create({
        data: {
          color: 'Branco',
          year: 2022,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 55000.0,
          modelId: testModel.id
        }
      });

      const response = await request(app.server).get('/api/cars').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('color');
      expect(response.body.data[0]).toHaveProperty('year');
      expect(response.body.data[0]).toHaveProperty('numberOfPorts');
      expect(response.body.data[0]).toHaveProperty('fuel');
      expect(response.body.data[0]).toHaveProperty('value');
      expect(response.body.data[0]).toHaveProperty('modelId');
    });
  });

  describe('GET /api/cars/:id', () => {
    it('deve retornar carro existente por ID', async () => {
      const car = await prisma.cars.create({
        data: {
          color: 'Prata',
          year: 2023,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 60000.0,
          modelId: testModel.id
        }
      });

      const response = await request(app.server)
        .get(`/api/cars/${car.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(car.id);
      expect(response.body.data.color).toBe('Prata');
      expect(response.body.data.year).toBe(2023);
      expect(response.body.data.numberOfPorts).toBe(4);
      expect(response.body.data.fuel).toBe('Gasolina');
      expect(response.body.data.value).toBe(60000.0);
      expect(response.body.data.modelId).toBe(testModel.id);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const response = await request(app.server)
        .get('/api/cars/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Carro não existe');
    });

    it('deve retornar 400 para ID inválido', async () => {
      await request(app.server).get('/api/cars/abc').expect(400);
    });

    it('deve retornar 400 para ID negativo', async () => {
      await request(app.server).get('/api/cars/-1').expect(400);
    });

    it('deve retornar 400 para ID zero', async () => {
      await request(app.server).get('/api/cars/0').expect(400);
    });
  });

  describe('POST /api/cars', () => {
    it('deve criar novo carro com sucesso', async () => {
      const newCar = {
        color: 'Verde',
        year: 2021,
        numberOfPorts: 4,
        fuel: 'Flex',
        value: 52000.0,
        modelId: testModel.id
      };

      const response = await request(app.server)
        .post('/api/cars')
        .send(newCar)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.color).toBe('Verde');
      expect(response.body.data.year).toBe(2021);
      expect(response.body.data.numberOfPorts).toBe(4);
      expect(response.body.data.fuel).toBe('Flex');
      expect(response.body.data.value).toBe(52000.0);
      expect(response.body.data.modelId).toBe(testModel.id);
      expect(response.body.data.id).toBeDefined();

      const savedCar = await prisma.cars.findUnique({
        where: { id: response.body.data.id }
      });
      expect(savedCar).toBeTruthy();
      expect(savedCar?.color).toBe('Verde');
    });

    it('deve rejeitar cor vazia', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: '',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 30000.0,
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar cor apenas com espaços', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: '   ',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar ano negativo', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: -1,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar ano zero', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 0,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar numberOfPorts negativo', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 2021,
          numberOfPorts: -1,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar numberOfPorts zero', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 2021,
          numberOfPorts: 0,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar fuel vazio', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 2021,
          numberOfPorts: 4,
          fuel: '',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar modelId inexistente', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: 999999,
          value: 50000.0
        })
        .expect(500);
    });

    it('deve rejeitar modelId negativo', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: -1
        })
        .expect(400);
    });

    it('deve rejeitar campos obrigatórios ausentes', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul'
        })
        .expect(400);
    });

    it('deve rejeitar tipos de dados incorretos', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 123,
          year: 'dois mil e vinte',
          numberOfPorts: 'quatro',
          fuel: 456,
          modelId: 'abc'
        })
        .expect(400);
    });

    it('deve rejeitar valor negativo', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: -1000.0,
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar valor zero', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 0,
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve aceitar cores com caracteres especiais válidos', async () => {
      const response = await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Azul-Metálico',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 47000.0,
          modelId: testModel.id
        })
        .expect(201);

      expect(response.body.data.color).toBe('Azul-Metálico');
    });

    it('deve trimmar espaços dos campos string', async () => {
      const response = await request(app.server)
        .post('/api/cars')
        .send({
          color: '  Amarelo  ',
          year: 2021,
          numberOfPorts: 4,
          fuel: '  Etanol  ',
          value: 33000.0,
          modelId: testModel.id
        })
        .expect(201);

      expect(response.body.data.color).toBe('Amarelo');
      expect(response.body.data.fuel).toBe('Etanol');
    });
  });

  describe('PUT /api/cars/:id', () => {
    it('deve atualizar carro existente', async () => {
      const car = await prisma.cars.create({
        data: {
          color: 'Original',
          year: 2020,
          numberOfPorts: 2,
          fuel: 'Gasolina',
          value: 35000.0,
          modelId: testModel.id
        }
      });

      const updateData = {
        color: 'Atualizado',
        year: 2022,
        numberOfPorts: 4,
        fuel: 'Flex',
        value: 55000.0,
        modelId: testModel.id
      };

      const response = await request(app.server)
        .put(`/api/cars/${car.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.color).toBe('Atualizado');
      expect(response.body.data.year).toBe(2022);
      expect(response.body.data.numberOfPorts).toBe(4);
      expect(response.body.data.fuel).toBe('Flex');
      expect(response.body.data.value).toBe(55000.0);
      expect(response.body.data.id).toBe(car.id);

      const updatedCar = await prisma.cars.findUnique({
        where: { id: car.id }
      });
      expect(updatedCar?.color).toBe('Atualizado');
      expect(updatedCar?.year).toBe(2022);
    });

    it('deve retornar 404 para ID inexistente na atualização', async () => {
      const response = await request(app.server)
        .put('/api/cars/999999')
        .send({
          color: 'Test',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id,
          value: 50000.0
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Carro não existe');
    });

    it('deve rejeitar dados inválidos na atualização', async () => {
      const car = await prisma.cars.create({
        data: {
          color: 'Valid',
          year: 2020,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 40000.0,
          modelId: testModel.id
        }
      });

      await request(app.server)
        .put(`/api/cars/${car.id}`)
        .send({
          color: '',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve manter dados originais quando atualização falha', async () => {
      const car = await prisma.cars.create({
        data: {
          color: 'Original Color',
          year: 2020,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 48000.0,
          modelId: testModel.id
        }
      });

      await request(app.server)
        .put(`/api/cars/${car.id}`)
        .send({
          color: '',
          year: 2022,
          numberOfPorts: 2,
          fuel: 'Etanol',
          modelId: testModel.id
        })
        .expect(400);

      const unchangedCar = await prisma.cars.findUnique({
        where: { id: car.id }
      });
      expect(unchangedCar?.color).toBe('Original Color');
      expect(unchangedCar?.year).toBe(2020);
    });
  });

  describe('DELETE /api/cars/:id', () => {
    it('deve deletar carro existente', async () => {
      const car = await prisma.cars.create({
        data: {
          color: 'To Delete',
          year: 2020,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 32000.0,
          modelId: testModel.id
        }
      });

      const response = await request(app.server)
        .delete(`/api/cars/${car.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data', null);

      const deletedCar = await prisma.cars.findUnique({
        where: { id: car.id }
      });
      expect(deletedCar).toBeNull();
    });

    it('deve retornar 404 para ID inexistente na deleção', async () => {
      const response = await request(app.server)
        .delete('/api/cars/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Carro não existe');
    });

    it('deve retornar 400 para ID inválido na deleção', async () => {
      await request(app.server).delete('/api/cars/abc').expect(400);
    });

    it('deve ser idempotente (não falhar ao deletar já deletado)', async () => {
      const car = await prisma.cars.create({
        data: {
          color: 'Delete Twice',
          year: 2020,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          value: 29000.0,
          modelId: testModel.id
        }
      });

      await request(app.server).delete(`/api/cars/${car.id}`).expect(200);
      await request(app.server).delete(`/api/cars/${car.id}`).expect(404);
    });
  });

  describe('Cenários de Segurança', () => {
    it('deve rejeitar XSS em campos de texto', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: '<script>alert("xss")</script>',
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar SQL injection em campos de texto', async () => {
      await request(app.server)
        .post('/api/cars')
        .send({
          color: "'; DROP TABLE cars; --",
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });

    it('deve rejeitar campos com tamanho excessivo', async () => {
      const longColor = 'A'.repeat(100);

      await request(app.server)
        .post('/api/cars')
        .send({
          color: longColor,
          year: 2021,
          numberOfPorts: 4,
          fuel: 'Gasolina',
          modelId: testModel.id
        })
        .expect(400);
    });
  });

  describe('Cenários de Performance', () => {
    it('deve lidar com múltiplas criações simultâneas', async () => {
      const promises = [];
      for (let i = 1; i <= 5; i++) {
        promises.push(
          request(app.server)
            .post('/api/cars')
            .send({
              color: `Color ${i}`,
              year: 2020 + i,
              numberOfPorts: 4,
              fuel: 'Gasolina',
              modelId: testModel.id,
              value: 30000.0
            })
        );
      }

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      });

      const cars = await prisma.cars.findMany();
      expect(cars.length).toBeGreaterThanOrEqual(5);
    });

    it('deve retornar lista grande de carros eficientemente', async () => {
      const carData = Array.from({ length: 20 }, (_, i) => ({
        color: `Performance Color ${i + 1}`,
        year: 2020,
        numberOfPorts: 4,
        fuel: 'Gasolina',
        value: 25000.0 + i * 1000,
        modelId: testModel.id
      }));

      await prisma.cars.createMany({ data: carData });

      const start = Date.now();
      const response = await request(app.server).get('/api/cars').expect(200);
      const duration = Date.now() - start;

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThanOrEqual(20);
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Cenários de Edge Cases', () => {
    it('deve aceitar anos válidos extremos', async () => {
      const response = await request(app.server)
        .post('/api/cars')
        .send({
          color: 'Vintage',
          year: 1886,
          numberOfPorts: 2,
          fuel: 'Gasolina',
          modelId: testModel.id,
          value: 30000.0
        })
        .expect(201);

      expect(response.body.data.year).toBe(1886);
    });

    it('deve aceitar números de portas diversos', async () => {
      const portNumbers = [1, 2, 3, 4, 5];

      for (const ports of portNumbers) {
        const response = await request(app.server)
          .post('/api/cars')
          .send({
            color: `Car ${ports} portas`,
            year: 2021,
            numberOfPorts: ports,
            fuel: 'Gasolina',
            modelId: testModel.id,
            value: 30000.0
          })
          .expect(201);

        expect(response.body.data.numberOfPorts).toBe(ports);
      }
    });

    it('deve manter consistência em operações CRUD rápidas', async () => {
      const carData = {
        color: 'CRUD Test',
        year: 2021,
        numberOfPorts: 4,
        fuel: 'Gasolina',
        value: 46000.0,
        modelId: testModel.id
      };

      const createResponse = await request(app.server)
        .post('/api/cars')
        .send(carData)
        .expect(201);

      const carId = createResponse.body.data.id;

      const getResponse = await request(app.server)
        .get(`/api/cars/${carId}`)
        .expect(200);

      expect(getResponse.body.data.color).toBe('CRUD Test');

      const updateResponse = await request(app.server)
        .put(`/api/cars/${carId}`)
        .send({
          ...carData,
          color: 'CRUD Atualizado',
          year: 2022
        })
        .expect(200);

      expect(updateResponse.body.data.color).toBe('CRUD Atualizado');
      expect(updateResponse.body.data.year).toBe(2022);

      await request(app.server).delete(`/api/cars/${carId}`).expect(200);

      await request(app.server).get(`/api/cars/${carId}`).expect(404);
    });
  });

  describe('GET /api/cars com filtros', () => {
    beforeEach(async () => {
      // Criar dados de teste para filtros
      const anotherBrand = await prisma.brand.create({
        data: { name: 'Filter Test Brand' }
      });

      const anotherModel = await prisma.model.create({
        data: {
          name: 'Filter Test Model',
          brandId: anotherBrand.id,
          fipeValue: 60000
        }
      });

      await prisma.cars.createMany({
        data: [
          {
            color: 'Vermelho',
            year: 2020,
            numberOfPorts: 4,
            fuel: 'Gasolina',
            value: 50000.0,
            modelId: testModel.id
          },
          {
            color: 'Azul',
            year: 2021,
            numberOfPorts: 2,
            fuel: 'Etanol',
            value: 45000.0,
            modelId: testModel.id
          },
          {
            color: 'Vermelho',
            year: 2022,
            numberOfPorts: 4,
            fuel: 'Flex',
            value: 65000.0,
            modelId: anotherModel.id
          },
          {
            color: 'Preto',
            year: 2019,
            numberOfPorts: 4,
            fuel: 'Gasolina',
            value: 40000.0,
            modelId: testModel.id
          },
          {
            color: 'Branco',
            year: 2023,
            numberOfPorts: 2,
            fuel: 'Híbrido',
            value: 70000.0,
            modelId: anotherModel.id
          }
        ]
      });
    });

    it('deve filtrar carros por cor', async () => {
      const response = await request(app.server)
        .get('/api/cars?color=Vermelho')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.color).toBe('Vermelho');
      });
    });

    it('deve filtrar carros por ano específico', async () => {
      const response = await request(app.server)
        .get('/api/cars?year=2021')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].year).toBe(2021);
      expect(response.body.data[0].color).toBe('Azul');
    });

    it('deve filtrar carros por range de anos', async () => {
      const response = await request(app.server)
        .get('/api/cars?yearGte=2020&yearLte=2022')
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.year).toBeGreaterThanOrEqual(2020);
        expect(car.year).toBeLessThanOrEqual(2022);
      });
    });

    it('deve filtrar carros por ano mínimo', async () => {
      const response = await request(app.server)
        .get('/api/cars?yearGte=2022')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.year).toBeGreaterThanOrEqual(2022);
      });
    });

    it('deve filtrar carros por ano máximo', async () => {
      const response = await request(app.server)
        .get('/api/cars?yearLte=2020')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.year).toBeLessThanOrEqual(2020);
      });
    });

    it('deve filtrar carros por combustível', async () => {
      const response = await request(app.server)
        .get('/api/cars?fuel=Gasolina')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.fuel).toBe('Gasolina');
      });
    });

    it('deve filtrar carros por número de portas', async () => {
      const response = await request(app.server)
        .get('/api/cars?numberOfPorts=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.numberOfPorts).toBe(2);
      });
    });

    it('deve filtrar carros por modelo específico', async () => {
      const response = await request(app.server)
        .get(`/api/cars?modelId=${testModel.id}`)
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.modelId).toBe(testModel.id);
      });
    });

    it('deve filtrar carros por nome da marca', async () => {
      const response = await request(app.server)
        .get('/api/cars?brandName=Filter Test Brand')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.model.brand.name).toBe('Filter Test Brand');
      });
    });

    it('deve combinar múltiplos filtros', async () => {
      const response = await request(app.server)
        .get('/api/cars?color=Vermelho&numberOfPorts=4')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.color).toBe('Vermelho');
        expect(car.numberOfPorts).toBe(4);
      });
    });

    it('deve ordenar carros por ano crescente', async () => {
      const response = await request(app.server)
        .get('/api/cars?sortBy=year&order=asc')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      const years = response.body.data.map((car: CarResponse) => car.year);
      expect(years).toEqual([2019, 2020, 2021, 2022, 2023]);
    });

    it('deve ordenar carros por ano decrescente', async () => {
      const response = await request(app.server)
        .get('/api/cars?sortBy=year&order=desc')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      const years = response.body.data.map((car: CarResponse) => car.year);
      expect(years).toEqual([2023, 2022, 2021, 2020, 2019]);
    });

    it('deve ordenar carros por cor', async () => {
      const response = await request(app.server)
        .get('/api/cars?sortBy=color&order=asc')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      const colors = response.body.data.map((car: CarResponse) => car.color);
      expect(colors[0]).toBe('Azul');
      expect(colors[colors.length - 1]).toBe('Vermelho');
    });

    it('deve implementar paginação', async () => {
      const page1Response = await request(app.server)
        .get('/api/cars?page=1&limit=2')
        .expect(200);

      expect(page1Response.body.data).toHaveLength(2);

      const page2Response = await request(app.server)
        .get('/api/cars?page=2&limit=2')
        .expect(200);

      expect(page2Response.body.data).toHaveLength(2);

      // Verificar que são carros diferentes
      const page1Ids = page1Response.body.data.map(
        (car: CarResponse) => car.id
      );
      const page2Ids = page2Response.body.data.map(
        (car: CarResponse) => car.id
      );
      expect(page1Ids).not.toEqual(page2Ids);
    });

    it('deve retornar array vazio para filtros que não correspondem', async () => {
      const response = await request(app.server)
        .get('/api/cars?color=Rosa')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
    });

    it('deve fazer busca case-insensitive para cor', async () => {
      const response = await request(app.server)
        .get('/api/cars?color=vermelho')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.color.toLowerCase()).toContain('vermelho');
      });
    });

    it('deve fazer busca case-insensitive para combustível', async () => {
      const response = await request(app.server)
        .get('/api/cars?fuel=gasolina')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.fuel.toLowerCase()).toContain('gasolina');
      });
    });

    it('deve fazer busca case-insensitive para nome da marca', async () => {
      const response = await request(app.server)
        .get('/api/cars?brandName=filter test brand')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });

    it('deve aceitar busca parcial por cor', async () => {
      const response = await request(app.server)
        .get('/api/cars?color=Ver')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.color).toContain('Vermelho');
      });
    });

    it('deve lidar com parâmetros de query inválidos graciosamente', async () => {
      const response = await request(app.server)
        .get('/api/cars?year=abc&numberOfPorts=invalid')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('deve combinar filtros, ordenação e paginação', async () => {
      const response = await request(app.server)
        .get('/api/cars?numberOfPorts=4&sortBy=year&order=desc&page=1&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car.numberOfPorts).toBe(4);
      });

      // Verificar ordenação
      const years = response.body.data.map((car: CarResponse) => car.year);
      expect(years[0]).toBeGreaterThanOrEqual(years[1]);
    });

    it('deve retornar todos os carros quando não há filtros', async () => {
      const response = await request(app.server).get('/api/cars').expect(200);

      expect(response.body.data).toHaveLength(5);
    });

    it('deve incluir dados do modelo e marca nos resultados filtrados', async () => {
      const response = await request(app.server)
        .get('/api/cars?color=Vermelho')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((car: CarResponse) => {
        expect(car).toHaveProperty('model');
        expect(car.model).toHaveProperty('brand');
        expect(car.model.brand).toHaveProperty('name');
      });
    });
  });
});
