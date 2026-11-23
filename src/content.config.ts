import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { AREA_NOMES } from './lib/areas';
const linhas = (v: unknown) =>
  typeof v === 'string'
    ? v.split(/\r?\n/).map((l) => l.replace(/^\s*(?:[-*•]\s*)+/, '').trim()).filter(Boolean)
    : v;
const listaTexto = z.preprocess(linhas, z.array(z.string()).min(1));
const listaOpcional = z.preprocess((v) => {
  const r = linhas(v);
  return Array.isArray(r) && r.length === 0 ? undefined : r;
}, z.array(z.string()).optional());

const vazio = <T extends z.ZodTypeAny>(s: T) => z.preprocess((v) => (v === null || v === '' || (Array.isArray(v) && v.length === 0) ? undefined : v), s.optional());

const vagas = defineCollection({
  // Arquivos que começam com "_" (como _MODELO.md) são ignorados.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/vagas' }),
  schema: z.object({
    titulo: z.string(),
    empresa: z.string(),
    area: z.enum(AREA_NOMES),
    objetivo: z.string(),
    funcao: listaTexto,
    requisitos: listaTexto,
    salario: vazio(z.string()),
    // Opcionais: usados só nos dados estruturados do Google (baseSalary).
    salario_min: vazio(z.number().positive()),
    salario_max: vazio(z.number().positive()),
    salario_periodo: z.enum(['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']).default('MONTH'),
    beneficios: listaOpcional,
    link_candidatura: z.string().url(),
    data_publicacao: z.coerce.date(),
    data_expiracao: z.preprocess((v) => (v === null || v === "" ? undefined : v), z.coerce.date().optional()),
  }).transform((d) => ({ ...d, data_expiracao: d.data_expiracao ?? new Date(d.data_publicacao.getTime() + 30 * 86400000) })),
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
