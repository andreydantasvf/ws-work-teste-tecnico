import { z } from 'zod';

// Função para validar e sanitizar nome do modelo
const validateModelName = (name: string) => {
  const trimmedName = name.trim();

  // Verificar se não é apenas espaços
  if (!trimmedName || trimmedName.length === 0) {
    throw new Error('Nome do modelo não pode ser apenas espaços em branco');
  }

  // Verificar se contém tags HTML ou scripts (prevenção XSS básico)
  if (/<[^>]*>/g.test(trimmedName)) {
    throw new Error('Nome do modelo não pode conter tags HTML');
  }

  // Verificar caracteres suspeitos de SQL injection
  const sqlInjectionPatterns = [
    /('|(\\')|(;)|(\\;)|(\\x27)|(\\x2D\\x2D)|(--)|(\|)|(\*)|(%)|(@))/i,
    /(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE|EXEC|EXECUTE)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmedName)) {
      throw new Error('Nome do modelo contém caracteres não permitidos');
    }
  }

  // Permitir apenas letras, números, espaços e alguns caracteres especiais seguros
  const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s\-&.()]+$/;
  if (!allowedPattern.test(trimmedName)) {
    throw new Error('Nome do modelo contém caracteres não permitidos');
  }

  return trimmedName;
};

export const modelFormSchema = z.object({
  name: z
    .string({ message: 'Nome do modelo é obrigatório' })
    .min(1, 'Nome do modelo é obrigatório')
    .max(100, 'Nome do modelo deve ter no máximo 100 caracteres')
    .transform(validateModelName)
    .refine(
      (name) => name.length >= 2,
      'Nome do modelo deve ter pelo menos 2 caracteres'
    ),
  brandId: z
    .number({ message: 'Marca é obrigatória' })
    .min(1, 'Marca é obrigatória'),
  fipeValue: z
    .number({ message: 'Valor da tabela FIPE é obrigatório' })
    .min(0, 'Valor da tabela FIPE deve ser um número positivo')
});

export type ModelFormData = z.infer<typeof modelFormSchema>;
