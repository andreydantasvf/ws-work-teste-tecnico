import { z } from 'zod';

// Função para validar e sanitizar nome da marca
const validateBrandName = (name: string) => {
  const trimmedName = name.trim();

  // Verificar se não é apenas espaços
  if (!trimmedName || trimmedName.length === 0) {
    throw new Error('Nome da marca não pode ser apenas espaços em branco');
  }

  // Verificar se contém tags HTML ou scripts (prevenção XSS básico)
  if (/<[^>]*>/g.test(trimmedName)) {
    throw new Error('Nome da marca não pode conter tags HTML');
  }

  // Verificar caracteres suspeitos de SQL injection
  const sqlInjectionPatterns = [
    /('|(\\')|(;)|(\\;)|(\\x27)|(\\x2D\\x2D)|(--)|(\|)|(\*)|(%)|(@))/i,
    /(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER|CREATE|EXEC|EXECUTE)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];

  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(trimmedName)) {
      throw new Error('Nome da marca contém caracteres não permitidos');
    }
  }

  // Permitir apenas letras, números, espaços e alguns caracteres especiais seguros
  const allowedPattern = /^[a-zA-ZÀ-ÿ0-9\s\-&.()]+$/;
  if (!allowedPattern.test(trimmedName)) {
    throw new Error('Nome da marca contém caracteres não permitidos');
  }

  return trimmedName;
};

export const brandFormSchema = z.object({
  name: z
    .string({ message: 'Nome da marca é obrigatório' })
    .min(1, 'Nome da marca é obrigatório')
    .max(100, 'Nome da marca deve ter no máximo 100 caracteres')
    .transform(validateBrandName)
    .refine(
      (name) => name.length >= 2,
      'Nome da marca deve ter pelo menos 2 caracteres'
    )
});

export type BrandFormData = z.infer<typeof brandFormSchema>;
