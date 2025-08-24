import { describe, it, expect, afterAll, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { createTestApp, closeTestApp } from '../helpers/app.helper';
import { prisma } from '../setup';

describe('Models Endpoints Integration Tests', () => {
  let app: FastifyInstance;
  let testBrand: { id: number; name: string };

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    testBrand = await prisma.brand.create({
      data: { name: 'Test Brand' }
    });
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /api/models', () => {
    it('deve retornar array vazio quando não há modelos', async () => {
      const response = await request(app.server).get('/api/models').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: []
      });
    });

    it('deve retornar todos os modelos cadastrados', async () => {
      await prisma.model.createMany({
        data: [
          { name: 'Civic', brandId: testBrand.id, fipeValue: 80000 },
          { name: 'Corolla', brandId: testBrand.id, fipeValue: 85000 },
          { name: 'Focus', brandId: testBrand.id, fipeValue: 75000 }
        ]
      });

      const response = await request(app.server).get('/api/models').expect(200);

      expect(response.body.data).toHaveLength(3);
      const modelNames = response.body.data.map(
        (m: { name: string }) => m.name
      );
      expect(modelNames).toContain('Civic');
      expect(modelNames).toContain('Corolla');
      expect(modelNames).toContain('Focus');
    });

    it('deve retornar modelos com estrutura correta', async () => {
      await prisma.model.create({
        data: { name: 'Fiesta', brandId: testBrand.id, fipeValue: 60000 }
      });

      const response = await request(app.server).get('/api/models').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('brandId');
      expect(response.body.data[0]).toHaveProperty('fipeValue');
      expect(response.body.data[0]).toHaveProperty('createdAt');
      expect(response.body.data[0]).toHaveProperty('updatedAt');
    });

    it('deve retornar modelos ordenados consistentemente', async () => {
      const modelData = Array.from({ length: 10 }, (_, i) => ({
        name: `Model ${String(i + 1).padStart(2, '0')}`,
        brandId: testBrand.id,
        fipeValue: 50000 + i * 1000
      }));

      await prisma.model.createMany({ data: modelData });

      const response = await request(app.server).get('/api/models').expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.data[0]).toHaveProperty('id');
    });
  });

  describe('GET /api/models/:id', () => {
    it('deve retornar modelo existente por ID', async () => {
      const model = await prisma.model.create({
        data: { name: 'Accord', brandId: testBrand.id, fipeValue: 90000 }
      });

      const response = await request(app.server)
        .get(`/api/models/${model.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(model.id);
      expect(response.body.data.name).toBe('Accord');
      expect(response.body.data.brandId).toBe(testBrand.id);
      expect(response.body.data.fipeValue).toBe(90000);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const response = await request(app.server)
        .get('/api/models/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Modelo não encontrado');
    });

    it('deve retornar 400 para ID inválido (string)', async () => {
      await request(app.server).get('/api/models/abc').expect(400);
    });

    it('deve retornar 400 para ID negativo', async () => {
      await request(app.server).get('/api/models/-1').expect(400);
    });

    it('deve retornar 400 para ID zero', async () => {
      await request(app.server).get('/api/models/0').expect(400);
    });
  });

  describe('POST /api/models', () => {
    it('deve criar novo modelo com sucesso', async () => {
      const newModel = {
        name: 'Camry',
        brandId: testBrand.id,
        fipeValue: 95000
      };

      const response = await request(app.server)
        .post('/api/models')
        .send(newModel)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('Camry');
      expect(response.body.data.brandId).toBe(testBrand.id);
      expect(response.body.data.fipeValue).toBe(95000);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();

      const savedModel = await prisma.model.findUnique({
        where: { id: response.body.data.id }
      });
      expect(savedModel).toBeTruthy();
      expect(savedModel?.name).toBe('Camry');
    });

    it('deve rejeitar criação de modelo duplicado', async () => {
      await prisma.model.create({
        data: { name: 'Prius', brandId: testBrand.id, fipeValue: 100000 }
      });

      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Prius',
          brandId: testBrand.id,
          fipeValue: 100000
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Já existe um modelo com este nome');
    });

    it('deve rejeitar nome vazio', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: '',
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar nome apenas com espaços', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: '   ',
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar payload sem nome', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar nome null', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: null,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar nome undefined', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: undefined,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar tipo de dado incorreto para nome', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 123,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar brandId inexistente', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model Test',
          brandId: '999999',
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar brandId vazio', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model Test',
          brandId: '',
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar brandId null', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model Test',
          brandId: null,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar brandId inválido (não numérico)', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model Test',
          brandId: 'abc',
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar fipeValue negativo', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model Test',
          brandId: testBrand.id,
          fipeValue: -1000
        })
        .expect(400);
    });

    it('deve aceitar fipeValue zero', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Free Model',
          brandId: testBrand.id,
          fipeValue: 0
        })
        .expect(201);

      expect(response.body.data.fipeValue).toBe(0);
    });

    it('deve rejeitar fipeValue null', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model Test',
          brandId: testBrand.id,
          fipeValue: null
        })
        .expect(400);
    });

    it('deve rejeitar fipeValue string', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model Test',
          brandId: testBrand.id,
          fipeValue: 'invalid'
        })
        .expect(400);
    });

    it('deve aceitar valores decimais para fipeValue', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Decimal Model',
          brandId: testBrand.id,
          fipeValue: 50000.5
        })
        .expect(201);

      expect(response.body.data.fipeValue).toBe(50000.5);
    });

    it('deve rejeitar Content-Type incorreto', async () => {
      await request(app.server)
        .post('/api/models')
        .set('Content-Type', 'text/plain')
        .send('invalid-payload')
        .expect(400);
    });

    it('deve aceitar nomes com caracteres especiais válidos', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'A4 Avant & Quattro (2.0)',
          brandId: testBrand.id,
          fipeValue: 120000
        })
        .expect(201);

      expect(response.body.data.name).toBe('A4 Avant & Quattro (2.0)');
    });

    it('deve aceitar nomes com números', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Model X 100D',
          brandId: testBrand.id,
          fipeValue: 300000
        })
        .expect(201);

      expect(response.body.data.name).toBe('Model X 100D');
    });

    it('deve aceitar nomes com acentos', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Citroën C4',
          brandId: testBrand.id,
          fipeValue: 70000
        })
        .expect(201);

      expect(response.body.data.name).toBe('Citroën C4');
    });

    it('deve trimmar espaços do nome', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: '  Trimmed Model  ',
          brandId: testBrand.id,
          fipeValue: 60000
        })
        .expect(201);

      expect(response.body.data.name).toBe('Trimmed Model');
    });

    it('deve rejeitar nome muito longo', async () => {
      const longName = 'A'.repeat(101);

      await request(app.server)
        .post('/api/models')
        .send({
          name: longName,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar nome muito curto', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'A',
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve aceitar nome com exatamente 2 caracteres', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Q7',
          brandId: testBrand.id,
          fipeValue: 250000
        })
        .expect(201);

      expect(response.body.data.name).toBe('Q7');
    });

    it('deve aceitar nome com exatamente 100 caracteres', async () => {
      const maxName = 'A'.repeat(100);

      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: maxName,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(201);

      expect(response.body.data.name).toBe(maxName);
    });
  });

  describe('PUT /api/models/:id', () => {
    it('deve atualizar modelo existente', async () => {
      const model = await prisma.model.create({
        data: { name: 'Old Model', brandId: testBrand.id, fipeValue: 40000 }
      });

      const updateData = {
        name: 'modelo atualizado',
        brandId: testBrand.id,
        fipeValue: 45000
      };

      const response = await request(app.server)
        .put(`/api/models/${model.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('modelo atualizado');
      expect(response.body.data.fipeValue).toBe(45000);
      expect(response.body.data.id).toBe(model.id);

      const updatedModel = await prisma.model.findUnique({
        where: { id: model.id }
      });
      expect(updatedModel?.name).toBe('modelo atualizado');
      expect(updatedModel?.fipeValue).toBe(45000);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const response = await request(app.server)
        .put('/api/models/999999')
        .send({
          name: 'Test',
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Modelo não encontrado');
    });

    it('deve rejeitar nome vazio na atualização', async () => {
      const model = await prisma.model.create({
        data: { name: 'Valid Model', brandId: testBrand.id, fipeValue: 50000 }
      });

      await request(app.server)
        .put(`/api/models/${model.id}`)
        .send({
          name: '',
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar ID inválido na atualização', async () => {
      await request(app.server)
        .put('/api/models/abc')
        .send({
          name: 'Test',
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve manter dados originais quando atualização falha', async () => {
      const model = await prisma.model.create({
        data: {
          name: 'Original Model',
          brandId: testBrand.id,
          fipeValue: 60000
        }
      });

      await request(app.server)
        .put(`/api/models/${model.id}`)
        .send({
          name: '',
          brandId: testBrand.id,
          fipeValue: 70000
        })
        .expect(400);

      const unchangedModel = await prisma.model.findUnique({
        where: { id: model.id }
      });
      expect(unchangedModel?.name).toBe('Original Model');
      expect(unchangedModel?.fipeValue).toBe(60000);
    });

    it('deve atualizar com nome contendo caracteres especiais', async () => {
      const model = await prisma.model.create({
        data: { name: 'Old Name', brandId: testBrand.id, fipeValue: 50000 }
      });

      const response = await request(app.server)
        .put(`/api/models/${model.id}`)
        .send({
          name: 'M3 Competition & Track',
          brandId: testBrand.id,
          fipeValue: 150000
        })
        .expect(200);

      expect(response.body.data.name).toBe('M3 Competition & Track');
    });

    it('deve atualizar brandId para marca diferente', async () => {
      const anotherBrand = await prisma.brand.create({
        data: { name: 'Another Brand' }
      });

      const model = await prisma.model.create({
        data: {
          name: 'Model Transfer',
          brandId: testBrand.id,
          fipeValue: 50000
        }
      });

      const response = await request(app.server)
        .put(`/api/models/${model.id}`)
        .send({
          name: 'Model Transfer',
          brandId: anotherBrand.id,
          fipeValue: 50000
        })
        .expect(200);

      expect(response.body.data.brandId).toBe(anotherBrand.id);
    });

    it('deve rejeitar brandId inexistente na atualização', async () => {
      const model = await prisma.model.create({
        data: { name: 'Test Model', brandId: testBrand.id, fipeValue: 50000 }
      });

      await request(app.server)
        .put(`/api/models/${model.id}`)
        .send({
          name: 'Test Model',
          brandId: '999999',
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve atualizar apenas fipeValue', async () => {
      const model = await prisma.model.create({
        data: { name: 'Price Update', brandId: testBrand.id, fipeValue: 50000 }
      });

      const response = await request(app.server)
        .put(`/api/models/${model.id}`)
        .send({
          name: 'Price Atualizado',
          brandId: testBrand.id,
          fipeValue: 55000
        })
        .expect(200);

      expect(response.body.data.name).toBe('Price Atualizado');
      expect(response.body.data.fipeValue).toBe(55000);
      expect(response.body.data.brandId).toBe(testBrand.id);
    });
  });

  describe('DELETE /api/models/:id', () => {
    it('deve deletar modelo existente', async () => {
      const model = await prisma.model.create({
        data: { name: 'To Delete', brandId: testBrand.id, fipeValue: 50000 }
      });

      const response = await request(app.server)
        .delete(`/api/models/${model.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data', null);

      const deletedModel = await prisma.model.findUnique({
        where: { id: model.id }
      });
      expect(deletedModel).toBeNull();
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const response = await request(app.server)
        .delete('/api/models/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Modelo não encontrado');
    });

    it('deve retornar 400 para ID inválido', async () => {
      await request(app.server).delete('/api/models/abc').expect(400);
    });

    it('deve retornar 400 para ID negativo', async () => {
      await request(app.server).delete('/api/models/-1').expect(400);
    });

    it('deve ser idempotente (não falhar ao deletar já deletado)', async () => {
      const model = await prisma.model.create({
        data: {
          name: 'To Delete Twice',
          brandId: testBrand.id,
          fipeValue: 50000
        }
      });

      await request(app.server).delete(`/api/models/${model.id}`).expect(200);
      await request(app.server).delete(`/api/models/${model.id}`).expect(404);
    });

    it('deve deletar modelo mesmo com Cars relacionados', async () => {
      const model = await prisma.model.create({
        data: {
          name: 'Model With Cars',
          brandId: testBrand.id,
          fipeValue: 50000
        }
      });

      await prisma.cars.create({
        data: {
          year: 2020,
          fuel: 'Gasoline',
          numberOfPorts: 4,
          color: 'Red',
          modelId: model.id
        }
      });

      await request(app.server).delete(`/api/models/${model.id}`).expect(200);

      const deletedModel = await prisma.model.findUnique({
        where: { id: model.id }
      });
      expect(deletedModel).toBeNull();
    });
  });

  describe('Cenários de Headers e Content-Type', () => {
    it('deve aceitar application/json para POST', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .set('Content-Type', 'application/json')
        .send(
          JSON.stringify({
            name: 'JSON Test',
            brandId: testBrand.id,
            fipeValue: 50000
          })
        )
        .expect(201);

      expect(response.body.data.name).toBe('JSON Test');
    });

    it('deve rejeitar XML payload', async () => {
      await request(app.server)
        .post('/api/models')
        .set('Content-Type', 'application/xml')
        .send('<model><name>XML Test</name></model>')
        .expect(415);
    });

    it('deve funcionar sem User-Agent', async () => {
      const response = await request(app.server)
        .get('/api/models')
        .unset('User-Agent')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('deve aceitar diferentes User-Agents', async () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'curl/7.68.0',
        'PostmanRuntime/7.26.8'
      ];

      for (const userAgent of userAgents) {
        const response = await request(app.server)
          .get('/api/models')
          .set('User-Agent', userAgent)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
      }
    });
  });

  describe('Cenários de Performance e Volume', () => {
    it('deve lidar com múltiplas criações simultâneas', async () => {
      const promises = [];
      for (let i = 1; i <= 5; i++) {
        promises.push(
          request(app.server)
            .post('/api/models')
            .send({
              name: `Concurrent Model ${i}`,
              brandId: testBrand.id,
              fipeValue: 50000 + i * 1000
            })
        );
      }

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      });

      const models = await prisma.model.findMany();
      expect(models.length).toBeGreaterThanOrEqual(5);
    });

    it('deve retornar lista grande de modelos eficientemente', async () => {
      const modelData = Array.from({ length: 50 }, (_, i) => ({
        name: `Performance Model ${i + 1}`,
        brandId: testBrand.id,
        fipeValue: 50000 + i * 1000
      }));

      await prisma.model.createMany({ data: modelData });

      const start = Date.now();
      const response = await request(app.server).get('/api/models').expect(200);
      const duration = Date.now() - start;

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThanOrEqual(50);
      expect(duration).toBeLessThan(1000);
    });

    it('deve lidar com atualizações simultâneas', async () => {
      const models = [];
      for (let i = 1; i <= 3; i++) {
        const model = await prisma.model.create({
          data: {
            name: `Modelo ${i}`,
            brandId: testBrand.id,
            fipeValue: 50000
          }
        });
        models.push(model);
      }

      const promises = models.map((model, index) =>
        request(app.server)
          .put(`/api/models/${model.id}`)
          .send({
            name: `Modelo Atualizado ${index + 1}`,
            brandId: testBrand.id,
            fipeValue: 60000 + index * 1000
          })
      );

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
      });
    });
  });

  describe('Cenários de Segurança', () => {
    it('deve sanitizar entrada para prevenir XSS básico', async () => {
      const maliciousName = '<script>alert("xss")</script>';

      await request(app.server)
        .post('/api/models')
        .send({
          name: maliciousName,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar SQL injection tentativas', async () => {
      const sqlInjection = "'; DROP TABLE models; --";

      await request(app.server)
        .post('/api/models')
        .send({
          name: sqlInjection,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar JavaScript injection', async () => {
      const jsInjection = 'javascript:alert("xss")';

      await request(app.server)
        .post('/api/models')
        .send({
          name: jsInjection,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve limitar tamanho excessivo de payload', async () => {
      const hugeName = 'A'.repeat(10000);

      await request(app.server)
        .post('/api/models')
        .send({
          name: hugeName,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar caracteres de controle Unicode', async () => {
      const controlChars = 'Model\u0000\u0001\u0002';

      await request(app.server)
        .post('/api/models')
        .send({
          name: controlChars,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });

    it('deve rejeitar tentativas de Path Traversal', async () => {
      const pathTraversal = '../../etc/passwd';

      await request(app.server)
        .post('/api/models')
        .send({
          name: pathTraversal,
          brandId: testBrand.id,
          fipeValue: 50000
        })
        .expect(400);
    });
  });

  describe('Cenários de Validação de Dados', () => {
    it('deve aceitar valores fipeValue extremos válidos', async () => {
      const extremeValue = 999999999.99;

      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Extreme Value',
          brandId: testBrand.id,
          fipeValue: extremeValue
        })
        .expect(201);

      expect(response.body.data.fipeValue).toBe(extremeValue);
    });

    it('deve rejeitar fipeValue com muitas casas decimais', async () => {
      await request(app.server)
        .post('/api/models')
        .send({
          name: 'Too Many Decimals',
          brandId: testBrand.id,
          fipeValue: 50000.123456789
        })
        .expect(201);
    });

    it('deve aceitar nomes com diferentes idiomas', async () => {
      const names = ['Модель', 'モデル', '모델', 'Μοντέλο', 'نموذج'];

      for (const [index, name] of names.entries()) {
        await request(app.server)
          .post('/api/models')
          .send({
            name: `${name} ${index}`,
            brandId: testBrand.id,
            fipeValue: 50000
          })
          .expect(400);
      }
    });

    it('deve manter integridade referencial com brands', async () => {
      const model = await prisma.model.create({
        data: {
          name: 'Integrity Test',
          brandId: testBrand.id,
          fipeValue: 50000
        }
      });

      await prisma.brand.delete({ where: { id: testBrand.id } });

      const orphanedModel = await prisma.model.findUnique({
        where: { id: model.id }
      });
      expect(orphanedModel).toBeNull();
    });
  });

  describe('Cenários de Edge Cases', () => {
    it('deve manter consistência em operações CRUD rápidas', async () => {
      const modelData = {
        name: 'CRUD Test',
        brandId: testBrand.id,
        fipeValue: 50000
      };

      const createResponse = await request(app.server)
        .post('/api/models')
        .send(modelData)
        .expect(201);

      const modelId = createResponse.body.data.id;

      const getResponse = await request(app.server)
        .get(`/api/models/${modelId}`)
        .expect(200);

      expect(getResponse.body.data.name).toBe('CRUD Test');

      const updateResponse = await request(app.server)
        .put(`/api/models/${modelId}`)
        .send({
          ...modelData,
          name: 'CRUD Atualizado',
          fipeValue: 55000
        })
        .expect(200);

      expect(updateResponse.body.data.name).toBe('CRUD Atualizado');
      expect(updateResponse.body.data.fipeValue).toBe(55000);

      await request(app.server).delete(`/api/models/${modelId}`).expect(200);

      await request(app.server).get(`/api/models/${modelId}`).expect(404);
    });

    it('deve lidar com payload malformado graciosamente', async () => {
      await request(app.server)
        .post('/api/models')
        .set('Content-Type', 'application/json')
        .send('{"name": "Test", "brandId": "1", "fipeValue":}')
        .expect(400);
    });

    it('deve rejeitar propriedades extras no payload', async () => {
      const response = await request(app.server)
        .post('/api/models')
        .send({
          name: 'Extra Props',
          brandId: testBrand.id,
          fipeValue: 50000,
          extraProperty: 'should be ignored',
          anotherExtra: 123
        })
        .expect(201);

      expect(response.body.data).not.toHaveProperty('extraProperty');
      expect(response.body.data).not.toHaveProperty('anotherExtra');
    });

    it('deve manter atomicidade em operações de criação', async () => {
      const invalidData = {
        name: 'Atomic Test',
        brandId: '999999',
        fipeValue: 50000
      };

      await request(app.server)
        .post('/api/models')
        .send(invalidData)
        .expect(400);

      const modelsAfterFail = await prisma.model.findMany({
        where: { name: 'Atomic Test' }
      });
      expect(modelsAfterFail).toHaveLength(0);
    });
  });
});
