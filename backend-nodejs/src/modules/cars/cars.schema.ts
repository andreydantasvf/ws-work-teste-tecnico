import { AppError } from '@/core/webserver/app-error';
import z from 'zod';

const validateCarStringField = (name: string) => {
  const trimmedName = name.trim();

  // Verificar se não é apenas espaços
  if (!trimmedName || trimmedName.length === 0) {
    throw new AppError('Este campo não pode ser apenas espaços em branco', 400);
  }

  // Verificar se contém tags HTML ou scripts (prevenção XSS básico)
  if (/<[^>]*>/g.test(trimmedName)) {
    throw new AppError('Este campo não pode conter tags HTML', 400);
  }

  // Verificar caracteres suspeitos de SQL injection
  const sqlInjectionPatterns = [
    /('|(\\')|(;)|(\\;)|(\\x27)|(\\x2D\\x2D)|(--)|(\|)|(\*)|(%)|(@))/i,
    /(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE|EXEC|EXECUTE)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmedName)) {
      throw new AppError('Este campo contém caracteres não permitidos', 400);
    }
  }

  // Permitir apenas letras, números, espaços e alguns caracteres especiais seguros
  const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s\-&.()]+$/;
  if (!allowedPattern.test(trimmedName)) {
    throw new AppError('Este campo contém caracteres não permitidos', 400);
  }

  return trimmedName;
};

export const createCarSchema = z.object({
  color: z
    .string({ message: 'Cor do carro é obrigatória' })
    .min(1, 'Cor do carro é obrigatória')
    .max(30, 'Cor do carro deve ter no máximo 30 caracteres')
    .transform(validateCarStringField)
    .refine(
      (name) => name.length >= 2,
      'Cor do carro deve ter pelo menos 2 caracteres'
    )
    .describe('Cor do carro. Exemplo: Vermelho'),
  year: z
    .number({ message: 'Ano do carro é obrigatório' })
    .min(1, 'Ano do carro deve ser um número positivo')
    .describe('Ano de fabricação do carro. Exemplo: 2020'),
  numberOfPorts: z
    .number({ message: 'Número de portas do carro é obrigatório' })
    .min(1, 'Número de portas do carro deve ser um número positivo')
    .describe('Número de portas do carro. Exemplo: 4'),
  fuel: z
    .string({ message: 'Tipo de combustível é obrigatório' })
    .min(2, 'Tipo de combustível deve ter pelo menos 2 caracteres')
    .max(30, 'Tipo de combustível deve ter no máximo 30 caracteres')
    .transform(validateCarStringField)
    .describe('Tipo de combustível do carro. Exemplo: Gasolina'),
  modelId: z
    .number({ message: 'ID do modelo é obrigatório' })
    .min(1, 'ID do modelo deve ser um número positivo')
    .describe('Identificador único do modelo. Exemplo: 1')
});

export const carIdSchema = z.object({
  id: z.coerce
    .number({ message: 'ID do carro deve ser um número' })
    .min(1, 'ID do carro deve ser um número positivo')
    .describe('Identificador único do carro. Exemplo: 1')
});

export const carsQuerySchema = z.object({
  color: z.string().optional().describe('Filtrar por cor do carro'),
  year: z.coerce.number().min(1886).optional().describe('Filtrar por ano'),
  yearGte: z.coerce
    .number()
    .min(1886)
    .optional()
    .describe('Ano maior ou igual'),
  yearLte: z.coerce
    .number()
    .min(1886)
    .optional()
    .describe('Ano menor ou igual'),
  fuel: z.string().optional().describe('Filtrar por tipo de combustível'),
  numberOfPorts: z.coerce
    .number()
    .min(1)
    .optional()
    .describe('Filtrar por número de portas'),
  modelId: z.coerce
    .number()
    .min(1)
    .optional()
    .describe('Filtrar por ID do modelo'),
  brandName: z.string().optional().describe('Filtrar por nome da marca'),
  sortBy: z
    .enum(['year', 'color', 'fuel', 'numberOfPorts'])
    .optional()
    .describe('Campo para ordenação'),
  order: z.enum(['asc', 'desc']).optional().describe('Ordem da ordenação'),
  page: z.coerce
    .number()
    .min(1)
    .optional()
    .describe('Número da página para paginação'),
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe('Limite de resultados por página')
});

/*
  OpenAPI helper schemas (Zod) - responses and components
*/

export const carSchema = z.object({
  id: z.number().int().describe('Identificador único do carro'),
  color: z.string().min(1).max(30).describe('Cor do carro'),
  year: z.number().min(1886).describe('Ano de fabricação do carro'),
  numberOfPorts: z.number().min(1).describe('Número de portas do carro'),
  fuel: z.string().min(2).max(30).describe('Tipo de combustível do carro'),
  modelId: z.number().min(1).describe('Identificador único do modelo'),
  createdAt: z.date().optional().describe('Data de criação do carro'),
  updatedAt: z.date().optional().describe('Data da última atualização'),
  model: z.object({
    name: z.string().min(2).max(100).describe('Nome do modelo do carro'),
    brand: z.object({
      name: z.string().min(2).max(100).describe('Nome da marca do carro')
    })
  })
});

export const createCarResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: carSchema.describe('Dados do carro criado/atualizado')
});

export const carsListResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: z.array(carSchema).describe('Lista de todos os carros cadastrados')
});

export const deleteCarResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: z.null().describe('Dados nulos indicando sucesso na exclusão')
});

export const errorResponseSchema = z.object({
  message: z.string().describe('Mensagem de erro descritiva'),
  statusCode: z.number().min(400).max(599).describe('Código de status HTTP'),
  error: z.any().describe('Detalhes do erro')
});

export type Car = z.infer<typeof carSchema>;
