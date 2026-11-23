import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { AREA_NOMES } from './lib/areas';
const vazio = <T extends z.ZodTypeAny>(s: T) => z.preprocess((v) => (v === null || v === '' || (Array.isArray(v) && v.length === 0) ? undefined : v), s.optional());

const vagas = defineCollection({
  // Arquivos que começam com "_" (como _MODELO.md) são ignorados.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/vagas' }),
  schema: z.object({
    titulo: z.string(),
    empresa: z.string(),
    area: z.enum(AREA_NOMES),
    objetivo: z.string(),
    funcao: z.array(z.string()).min(1),
    requisitos: z.array(z.string()).min(1),
    salario: vazio(z.string()),
    // Opcionais: usados só nos dados estruturados do Google (baseSalary).
    salario_min: vazio(z.number().positive()),
    salario_max: vazio(z.number().positive()),
    salario_periodo: z.enum(['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']).default('MONTH'),
    beneficios: vazio(z.array(z.string())),
    link_candidatura: z.string().url(),
    data_publicacao: z.coerce.date(),
    data_expiracao: z.coerce.date(),
  }),
});

const dicas = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/dicas' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    data_publicacao: z.coerce.date(),
    data_atualizacao: z.coerce.date().optional(),
  }),
});

export const collections = { vagas, dicas };
