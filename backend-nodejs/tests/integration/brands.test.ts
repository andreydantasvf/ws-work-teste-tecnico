import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { createTestApp, closeTestApp } from '../helpers/app.helper';
import { prisma } from '../setup';

describe('Brands Endpoints Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /api/brands', () => {
    it('deve retornar lista vazia quando não há marcas', async () => {
      const response = await request(app.server).get('/api/brands').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    });

    it('deve retornar todas as marcas com paginação padrão', async () => {
      await prisma.brand.createMany({
        data: [{ name: 'Toyota' }, { name: 'Honda' }, { name: 'Ford' }]
      });

      const response = await request(app.server).get('/api/brands').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      });

      const brandNames = response.body.data.map(
        (b: { name: string }) => b.name
      );
      expect(brandNames).toContain('Toyota');
      expect(brandNames).toContain('Honda');
      expect(brandNames).toContain('Ford');
    });

    it('deve retornar marcas com estrutura correta incluindo paginação', async () => {
      await prisma.brand.create({
        data: { name: 'BMW' }
      });

      const response = await request(app.server).get('/api/brands').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('createdAt');
      expect(response.body.data[0]).toHaveProperty('updatedAt');
    });

    it('deve funcionar com paginação personalizada', async () => {
      const brandNames = Array.from({ length: 15 }, (_, i) => `Marca ${i + 1}`);
      await prisma.brand.createMany({
        data: brandNames.map((name) => ({ name }))
      });

      const response = await request(app.server)
        .get('/api/brands?page=2&limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3,
        hasNext: true,
        hasPrev: true
      });
    });

    it('deve funcionar com busca por nome', async () => {
      await prisma.brand.createMany({
        data: [
          { name: 'Toyota Corolla' },
          { name: 'Honda Civic' },
          { name: 'Ford Focus' },
          { name: 'Toyota Camry' }
        ]
      });

      const response = await request(app.server)
        .get('/api/brands?search=Toyota')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(
        response.body.data.every((brand: { name: string }) =>
          brand.name.includes('Toyota')
        )
      ).toBe(true);
      expect(response.body.pagination.total).toBe(2);
    });

    it('deve funcionar com ordenação por nome crescente', async () => {
      await prisma.brand.createMany({
        data: [{ name: 'Zebra' }, { name: 'Apple' }, { name: 'Microsoft' }]
      });

      const response = await request(app.server)
        .get('/api/brands?sortBy=name&sortOrder=asc')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].name).toBe('Apple');
      expect(response.body.data[1].name).toBe('Microsoft');
      expect(response.body.data[2].name).toBe('Zebra');
    });

    it('deve funcionar com ordenação por nome decrescente', async () => {
      await prisma.brand.createMany({
        data: [{ name: 'Apple' }, { name: 'Microsoft' }, { name: 'Zebra' }]
      });

      const response = await request(app.server)
        .get('/api/brands?sortBy=name&sortOrder=desc')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].name).toBe('Zebra');
      expect(response.body.data[1].name).toBe('Microsoft');
      expect(response.body.data[2].name).toBe('Apple');
    });

    it('deve rejeitar página inválida', async () => {
      await request(app.server).get('/api/brands?page=0').expect(400);
    });

    it('deve rejeitar limite muito alto', async () => {
      await request(app.server).get('/api/brands?limit=200').expect(400);
    });

    it('deve rejeitar busca muito curta', async () => {
      await request(app.server).get('/api/brands?search=a').expect(400);
    });

    it('deve rejeitar sortBy inválido', async () => {
      await request(app.server).get('/api/brands?sortBy=invalid').expect(400);
    });

    it('deve rejeitar sortOrder inválido', async () => {
      await request(app.server)
        .get('/api/brands?sortOrder=invalid')
        .expect(400);
    });

    it('deve combinar busca, paginação e ordenação', async () => {
      await prisma.brand.createMany({
        data: [
          { name: 'Toyota Corolla' },
          { name: 'Toyota Camry' },
          { name: 'Toyota Prius' },
          { name: 'Honda Civic' },
          { name: 'Honda Accord' }
        ]
      });

      const response = await request(app.server)
        .get(
          '/api/brands?search=Toyota&page=1&limit=2&sortBy=name&sortOrder=desc'
        )
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe('Toyota Prius');
      expect(response.body.data[1].name).toBe('Toyota Corolla');
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNext: true,
        hasPrev: false
      });
    });
  });

  describe('GET /api/brands/:id', () => {
    it('deve retornar marca existente por ID', async () => {
      const brand = await prisma.brand.create({
        data: { name: 'Mercedes' }
      });

      const response = await request(app.server)
        .get(`/api/brands/${brand.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(brand.id);
      expect(response.body.data.name).toBe('Mercedes');
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const response = await request(app.server)
        .get('/api/brands/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Marca não encontrada');
    });

    it('deve retornar 400 para ID inválido (string)', async () => {
      await request(app.server).get('/api/brands/abc').expect(400);
    });

    it('deve retornar 400 para ID negativo', async () => {
      await request(app.server).get('/api/brands/-1').expect(400);
    });

    it('deve retornar 400 para ID zero', async () => {
      await request(app.server).get('/api/brands/0').expect(400);
    });
  });

  describe('POST /api/brands', () => {
    it('deve criar nova marca com sucesso', async () => {
      const newBrand = { name: 'Tesla' };

      const response = await request(app.server)
        .post('/api/brands')
        .send(newBrand)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('Tesla');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();

      const savedBrand = await prisma.brand.findUnique({
        where: { id: response.body.data.id }
      });
      expect(savedBrand).toBeTruthy();
      expect(savedBrand?.name).toBe('Tesla');
    });

    it('deve rejeitar criação de marca duplicada', async () => {
      await prisma.brand.create({
        data: { name: 'Volkswagen' }
      });

      const response = await request(app.server)
        .post('/api/brands')
        .send({ name: 'Volkswagen' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Marca já existe');
    });

    it('deve rejeitar nome vazio', async () => {
      await request(app.server)
        .post('/api/brands')
        .send({ name: '' })
        .expect(400);
    });

    it('deve rejeitar nome apenas com espaços', async () => {
      await request(app.server)
        .post('/api/brands')
        .send({ name: '   ' })
        .expect(400);
    });

    it('deve rejeitar payload sem nome', async () => {
      await request(app.server).post('/api/brands').send({}).expect(400);
    });

    it('deve rejeitar nome null', async () => {
      await request(app.server)
        .post('/api/brands')
        .send({ name: null })
        .expect(400);
    });

    it('deve rejeitar nome undefined', async () => {
      await request(app.server)
        .post('/api/brands')
        .send({ name: undefined })
        .expect(400);
    });

    it('deve rejeitar tipo de dado incorreto para nome', async () => {
      await request(app.server)
        .post('/api/brands')
        .send({ name: 123 })
        .expect(400);
    });

    it('deve rejeitar Content-Type incorreto', async () => {
      await request(app.server)
        .post('/api/brands')
        .set('Content-Type', 'text/plain')
        .send('invalid-payload')
        .expect(400);
    });

    it('deve aceitar nomes com caracteres especiais válidos', async () => {
      const response = await request(app.server)
        .post('/api/brands')
        .send({ name: 'Citroën & Peugeot' })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('Citroën & Peugeot');
    });

    it('deve aceitar nomes com números', async () => {
      const response = await request(app.server)
        .post('/api/brands')
        .send({ name: 'Audi A4' })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('Audi A4');
    });
  });

  describe('PUT /api/brands/:id', () => {
    it('deve atualizar marca existente', async () => {
      const brand = await prisma.brand.create({
        data: { name: 'Fiat' }
      });

      const updateData = { name: 'Fiat Automobiles' };

      const response = await request(app.server)
        .put(`/api/brands/${brand.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('Fiat Automobiles');
      expect(response.body.data.id).toBe(brand.id);

      const updatedBrand = await prisma.brand.findUnique({
        where: { id: brand.id }
      });
      expect(updatedBrand?.name).toBe('Fiat Automobiles');
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const response = await request(app.server)
        .put('/api/brands/999999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Marca não encontrada');
    });

    it('deve rejeitar nome vazio na atualização', async () => {
      const brand = await prisma.brand.create({
        data: { name: 'Valid Brand' }
      });

      await request(app.server)
        .put(`/api/brands/${brand.id}`)
        .send({ name: '' })
        .expect(400);
    });

    it('deve rejeitar ID inválido na atualização', async () => {
      await request(app.server)
        .put('/api/brands/abc')
        .send({ name: 'Test' })
        .expect(400);
    });

    it('deve manter dados originais quando atualização falha', async () => {
      const brand = await prisma.brand.create({
        data: { name: 'Original Name' }
      });

      await request(app.server)
        .put(`/api/brands/${brand.id}`)
        .send({ name: '' })
        .expect(400);

      const unchangedBrand = await prisma.brand.findUnique({
        where: { id: brand.id }
      });
      expect(unchangedBrand?.name).toBe('Original Name');
    });

    it('deve atualizar com nome contendo caracteres especiais', async () => {
      const brand = await prisma.brand.create({
        data: { name: 'Old Name' }
      });

      const response = await request(app.server)
        .put(`/api/brands/${brand.id}`)
        .send({ name: 'Rolls-Royce & Bentley' })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('Rolls-Royce & Bentley');
    });
  });

  describe('DELETE /api/brands/:id', () => {
    it('deve deletar marca existente', async () => {
      const brand = await prisma.brand.create({
        data: { name: 'To Delete' }
      });

      const response = await request(app.server)
        .delete(`/api/brands/${brand.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data', null);

      const deletedBrand = await prisma.brand.findUnique({
        where: { id: brand.id }
      });
      expect(deletedBrand).toBeNull();
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const response = await request(app.server)
        .delete('/api/brands/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Marca não encontrada');
    });

    it('deve retornar 400 para ID inválido', async () => {
      await request(app.server).delete('/api/brands/abc').expect(400);
    });

    it('deve retornar 400 para ID negativo', async () => {
      await request(app.server).delete('/api/brands/-1').expect(400);
    });

    it('deve ser idempotente (não falhar ao deletar já deletado)', async () => {
      const brand = await prisma.brand.create({
        data: { name: 'To Delete Twice' }
      });

      await request(app.server).delete(`/api/brands/${brand.id}`).expect(200);

      await request(app.server).delete(`/api/brands/${brand.id}`).expect(404);
    });
  });

  describe('Cenários de Headers e Content-Type', () => {
    it('deve aceitar application/json para POST', async () => {
      const response = await request(app.server)
        .post('/api/brands')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ name: 'JSON Test' }))
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('JSON Test');
    });

    it('deve rejeitar XML payload', async () => {
      await request(app.server)
        .post('/api/brands')
        .set('Content-Type', 'application/xml')
        .send('<brand><name>XML Test</name></brand>')
        .expect(415);
    });

    it('deve funcionar sem User-Agent', async () => {
      const response = await request(app.server)
        .get('/api/brands')
        .unset('User-Agent')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('Cenários de Performance e Volume', () => {
    it('deve lidar com múltiplas criações simultâneas', async () => {
      const promises = [];
      for (let i = 1; i <= 5; i++) {
        promises.push(
          request(app.server)
            .post('/api/brands')
            .send({ name: `Brand ${i}` })
        );
      }

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      });

      const brands = await prisma.brand.findMany();
      expect(brands).toHaveLength(5);
    });

    it('deve retornar lista grande de marcas eficientemente', async () => {
      const brandData = Array.from({ length: 50 }, (_, i) => ({
        name: `Brand ${i + 1}`
      }));

      await prisma.brand.createMany({ data: brandData });

      const start = Date.now();
      const response = await request(app.server)
        .get('/api/brands?page=1&limit=50')
        .expect(200);
      const duration = Date.now() - start;

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(50);
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Cenários de Segurança', () => {
    it('deve sanitizar entrada para prevenir XSS básico', async () => {
      const maliciousName = '<script>alert("xss")</script>';

      await request(app.server)
        .post('/api/brands')
        .send({ name: maliciousName })
        .expect(400);
    });

    it('deve rejeitar SQL injection tentativas', async () => {
      const sqlInjection = "'; DROP TABLE brands; --";

      await request(app.server)
        .post('/api/brands')
        .send({ name: sqlInjection })
        .expect(400);
    });

    it('deve limitar tamanho excessivo de payload', async () => {
      const hugeName = 'A'.repeat(10000);

      await request(app.server)
        .post('/api/brands')
        .send({ name: hugeName })
        .expect(400);
    });
  });
});
