import z from 'zod';

export const createBrandSchema = z.object({
  name: z
    .string({ message: 'Nome da marca é obrigatório' })
    .min(2, 'Nome da marca deve ter pelo menos 2 caracteres')
    .max(100, 'Nome da marca deve ter no máximo 100 caracteres')
});

export const brandIdSchema = z.object({
  id: z.coerce
    .number({ message: 'ID da marca deve ser um número' })
    .min(1, 'ID da marca deve ser um número positivo')
});
