import { z } from 'zod';

const validateCarStringField = (name: string) => {
  const trimmedName = name.trim();

  // Verificar se não é apenas espaços
  if (!trimmedName || trimmedName.length === 0) {
    throw new Error('Este campo não pode ser apenas espaços em branco');
  }

  // Verificar se contém tags HTML ou scripts (prevenção XSS básico)
  if (/<[^>]*>/g.test(trimmedName)) {
    throw new Error('Este campo não pode conter tags HTML');
  }

  // Verificar caracteres suspeitos de SQL injection
  const sqlInjectionPatterns = [
    /('|(\\')|(;)|(\\;)|(\\x27)|(\\x2D\\x2D)|(--)|(\|)|(\*)|(%)|(@))/i,
    /(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE|EXEC|EXECUTE)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmedName)) {
      throw new Error('Este campo contém caracteres não permitidos');
    }
  }

  // Permitir apenas letras, números, espaços e alguns caracteres especiais seguros
  const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s\-&.()]+$/;
  if (!allowedPattern.test(trimmedName)) {
    throw new Error('Este campo contém caracteres não permitidos');
  }

  return trimmedName;
};

export const carFormSchema = z.object({
  color: z
    .string({ message: 'Cor do carro é obrigatória' })
    .min(1, 'Cor do carro é obrigatória')
    .max(30, 'Cor do carro deve ter no máximo 30 caracteres')
    .transform(validateCarStringField)
    .refine(
      (name) => name.length >= 2,
      'Cor do carro deve ter pelo menos 2 caracteres'
    ),
  year: z
    .number({ message: 'Ano do carro é obrigatório' })
    .min(1886, 'Ano deve ser maior que 1886')
    .max(
      new Date().getFullYear() + 1,
      `Ano deve ser menor ou igual a ${new Date().getFullYear() + 1}`
    ),
  numberOfPorts: z
    .number({ message: 'Número de portas do carro é obrigatório' })
    .min(1, 'Número de portas do carro deve ser um número positivo'),
  fuel: z
    .string({ message: 'Tipo de combustível é obrigatório' })
    .min(2, 'Tipo de combustível deve ter pelo menos 2 caracteres')
    .max(30, 'Tipo de combustível deve ter no máximo 30 caracteres')
    .transform(validateCarStringField),
  value: z
    .number({ message: 'Valor do carro é obrigatório' })
    .min(0.01, 'Valor do carro deve ser maior que zero'),
  modelId: z
    .number({ message: 'Modelo é obrigatório' })
    .min(1, 'Modelo é obrigatório')
});

export type CarFormData = z.infer<typeof carFormSchema>;
