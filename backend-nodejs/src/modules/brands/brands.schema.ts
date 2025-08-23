import z from 'zod';

export const createBrandSchema = z.object({
  name: z
    .string({ message: 'Nome da marca é obrigatório' })
    .min(2, 'Nome da marca deve ter pelo menos 2 caracteres')
    .max(100, 'Nome da marca deve ter no máximo 100 caracteres')
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
  success: z.literal(false).describe('Indica que a operação falhou'),
  message: z.string().describe('Mensagem de erro descritiva'),
  errors: z
    .array(z.any())
    .optional()
    .describe('Lista detalhada de erros de validação')
});

export type Brand = z.infer<typeof brandSchema>;
