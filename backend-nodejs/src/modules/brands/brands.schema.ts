import { AppError } from '@/core/webserver/app-error';
import z from 'zod';

// Função para validar e sanitizar nome da marca
const validateBrandName = (name: string) => {
  const trimmedName = name.trim();

  // Verificar se não é apenas espaços
  if (!trimmedName || trimmedName.length === 0) {
    throw new AppError(
      'Nome da marca não pode ser apenas espaços em branco',
      400
    );
  }

  // Verificar se contém tags HTML ou scripts (prevenção XSS básico)
  if (/<[^>]*>/g.test(trimmedName)) {
    throw new AppError('Nome da marca não pode conter tags HTML', 400);
  }

  // Verificar caracteres suspeitos de SQL injection
  const sqlInjectionPatterns = [
    /('|(\\')|(;)|(\\;)|(\\x27)|(\\x2D\\x2D)|(--)|(\|)|(\*)|(%)|(@))/i,
    /(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE|EXEC|EXECUTE)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmedName)) {
      throw new AppError('Nome da marca contém caracteres não permitidos', 400);
    }
  }

  // Permitir apenas letras, números, espaços e alguns caracteres especiais seguros
  const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s\-&.()]+$/;
  if (!allowedPattern.test(trimmedName)) {
    throw new AppError('Nome da marca contém caracteres não permitidos', 400);
  }

  return trimmedName;
};

export const createBrandSchema = z.object({
  name: z
    .string({ message: 'Nome da marca é obrigatório' })
    .min(1, 'Nome da marca é obrigatório')
    .max(100, 'Nome da marca deve ter no máximo 100 caracteres')
    .transform(validateBrandName)
    .refine(
      (name) => name.length >= 2,
      'Nome da marca deve ter pelo menos 2 caracteres'
    )
    .describe('Nome da marca de veículo. Exemplo: Toyota')
});

export const brandIdSchema = z.object({
  id: z.coerce
    .number({ message: 'ID da marca deve ser um número' })
    .min(1, 'ID da marca deve ser um número positivo')
    .describe('Identificador único da marca. Exemplo: 1')
});

/*
  OpenAPI helper schemas (Zod) - responses and components
*/

export const brandSchema = z.object({
  id: z.number().int().describe('Identificador único da marca'),
  name: z.string().min(2).max(100).describe('Nome da marca'),
  createdAt: z.date().optional().describe('Data de criação da marca'),
  updatedAt: z.date().optional().describe('Data da última atualização')
});

export const createBrandResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: brandSchema.describe('Dados da marca criada/atualizada')
});

export const brandsListResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: z.array(brandSchema).describe('Lista de todas as marcas cadastradas')
});

export const deleteBrandResponseSchema = z.object({
  success: z.literal(true).describe('Indica se a operação foi bem-sucedida'),
  data: z.null().describe('Dados nulos indicando sucesso na exclusão')
});

export const errorResponseSchema = z.object({
  message: z.string().describe('Mensagem de erro descritiva'),
  statusCode: z.number().min(400).max(599).describe('Código de status HTTP'),
  error: z.any().describe('Detalhes do erro')
});

export type Brand = z.infer<typeof brandSchema>;
