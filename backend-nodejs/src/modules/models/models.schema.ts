import { AppError } from '@/core/webserver/app-error';
import z from 'zod';

// Função para validar e sanitizar nome do modelo
const validateModelName = (name: string) => {
  const trimmedName = name.trim();

  // Verificar se não é apenas espaços
  if (!trimmedName || trimmedName.length === 0) {
    throw new AppError(
      'Nome do modelo não pode ser apenas espaços em branco',
      400
    );
  }

  // Verificar se contém tags HTML ou scripts (prevenção XSS básico)
  if (/<[^>]*>/g.test(trimmedName)) {
    throw new AppError('Nome do modelo não pode conter tags HTML', 400);
  }

  // Verificar caracteres suspeitos de SQL injection
  const sqlInjectionPatterns = [
    /('|(\\')|(;)|(\\;)|(\\x27)|(\\x2D\\x2D)|(--)|(\|)|(\*)|(%)|(@))/i,
    /(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE|EXEC|EXECUTE)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmedName)) {
      throw new AppError(
        'Nome do modelo contém caracteres não permitidos',
        400
      );
    }
  }

  // Permitir apenas letras, números, espaços e alguns caracteres especiais seguros
  const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s\-&.()]+$/;
  if (!allowedPattern.test(trimmedName)) {
    throw new AppError('Nome do modelo contém caracteres não permitidos', 400);
  }

  return trimmedName;
};

export const createModelSchema = z.object({
  name: z
    .string({ message: 'Nome do modelo é obrigatório' })
    .min(1, 'Nome do modelo é obrigatório')
    .max(100, 'Nome do modelo deve ter no máximo 100 caracteres')
    .transform(validateModelName)
    .refine(
      (name) => name.length >= 2,
      'Nome do modelo deve ter pelo menos 2 caracteres'
    )
    .describe('Nome do modelo de veículo. Exemplo: Toyota'),
  brandId: z
    .number({ message: 'ID da marca é obrigatório' })
    .min(1, 'ID da marca é obrigatório')
    .describe('Identificador único da marca. Exemplo: 1'),
  fipeValue: z
    .number({ message: 'Valor da tabela FIPE é obrigatório' })
    .min(0, 'Valor da tabela FIPE deve ser um número positivo')
    .describe('Valor da tabela FIPE do modelo. Exemplo: 50000')
});

export const modelIdSchema = z.object({
  id: z.coerce
    .number({ message: 'ID do modelo deve ser um número' })
    .min(1, 'ID do modelo deve ser um número positivo')
    .describe('Identificador único do modelo. Exemplo: 1')
});

/*
  OpenAPI helper schemas (Zod) - responses and components
*/

export const modelSchema = z.object({
  id: z.number().int().describe('Identificador único do modelo'),
  name: z.string().min(2).max(100).describe('Nome do modelo'),
  brandId: z.number().int().describe('Identificador único da marca'),
  fipeValue: z.number().min(0).describe('Valor da tabela FIPE do modelo'),
  createdAt: z.date().optional().describe('Data de criação do modelo'),
  updatedAt: z.date().optional().describe('Data da última atualização')
});

export const createModelResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: modelSchema.describe('Dados do modelo criado/atualizado')
});

export const modelsListResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: z.array(modelSchema).describe('Lista de todos os modelos cadastrados')
});

export const deleteModelResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: z.null().describe('Dados nulos indicando sucesso na exclusão')
});

export const errorResponseSchema = z.object({
  message: z.string().describe('Mensagem de erro descritiva'),
  statusCode: z.number().min(400).max(599).describe('Código de status HTTP'),
  error: z.any().describe('Detalhes do erro')
});

export type Model = z.infer<typeof modelSchema>;
