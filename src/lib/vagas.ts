import { getCollection, type CollectionEntry } from 'astro:content';
import type { AREA_NOMES } from './areas';

export type Vaga = CollectionEntry<'vagas'>;
export type Dica = CollectionEntry<'dicas'>;

export interface Area {
  nome: (typeof AREA_NOMES)[number];
  slug: string;
  intro: string;
}

/** Textos curtos e únicos de cada área (ajudam o SEO e evitam páginas "vazias"). */
export const AREAS: Area[] = [
  {
    nome: 'Administrativo',
    slug: 'administrativo',
    intro:
      'Vagas remotas de assistente, analista e coordenador administrativo: rotinas de escritório, organização de documentos, agenda, atendimento interno e apoio à gestão, tudo feito de casa.',
  },
  {
    nome: 'Atendimento ao Cliente',
    slug: 'atendimento-ao-cliente',
    intro:
      'Oportunidades home office em suporte, SAC, sucesso do cliente e relacionamento. Veja vagas de atendimento por chat, e-mail e telefone, com ou sem experiência.',
  },
  {
    nome: 'Tecnologia',
    slug: 'tecnologia',
    intro:
      'Vagas remotas para quem trabalha com desenvolvimento, dados, infraestrutura, QA e produto digital. Equipes distribuídas contratando em todo o Brasil.',
  },
  {
    nome: 'Marketing',
    slug: 'marketing',
    intro:
      'Trabalho remoto em marketing digital, conteúdo, redes sociais, SEO, mídia paga e comunicação. Vagas para quem cria, analisa e divulga marcas de qualquer lugar.',
  },
  {
    nome: 'Vendas',
    slug: 'vendas',
    intro:
      'Vagas home office de vendas internas, pré-vendas, SDR e contas-chave. Veja oportunidades com salário fixo, comissão e metas claras.',
  },
  {
    nome: 'RH',
    slug: 'rh',
    intro:
      'Oportunidades remotas em recrutamento e seleção, departamento pessoal, treinamento e cultura. Vagas para quem cuida de pessoas, mesmo à distância.',
  },
  {
    nome: 'Financeiro',
    slug: 'financeiro',
    intro:
      'Vagas remotas em contas a pagar e receber, controladoria, fiscal, tesouraria e análise financeira para quem quer trabalhar de casa.',
  },
  {
    nome: 'Design',
    slug: 'design',
    intro:
      'Trabalho home office em design gráfico, UX/UI, motion e criação de conteúdo visual. Vagas para quem leva o portfólio para qualquer lugar.',
  },
];

export const areaPorNome = (nome: string) => AREAS.find((a) => a.nome === nome)!;
export const areaPorSlug = (slug: string) => AREAS.find((a) => a.slug === slug);

const DIA_MS = 24 * 60 * 60 * 1000;

/** Dia (AAAA-MM-DD) tal como escrito no arquivo da vaga. */
export const diaISO = (d: Date) => d.toISOString().slice(0, 10);

/** A vaga vale até o fim do dia de expiração, no horário de Brasília (UTC-3). */
export const fimDaVagaISO = (v: Vaga) => `${diaISO(v.data.data_expiracao)}T23:59:59-03:00`;

export const estaAtiva = (v: Vaga, agora = Date.now()) => Date.parse(fimDaVagaISO(v)) >= agora;

const maisRecentesPrimeiro = (a: Vaga, b: Vaga) =>
  b.data.data_publicacao.getTime() - a.data.data_publicacao.getTime();

/** Todas as vagas, inclusive encerradas (usado para gerar as páginas individuais). */
export async function todasAsVagas(): Promise<Vaga[]> {
  return (await getCollection('vagas'))
    .filter((v) => v.data.data_publicacao.getTime() <= Date.now())
    .sort(maisRecentesPrimeiro);
}

/** Somente vagas abertas, da mais recente para a mais antiga. */
export async function vagasAtivas(): Promise<Vaga[]> {
  return (await todasAsVagas()).filter((v) => estaAtiva(v));
}

export async function todasAsDicas(): Promise<Dica[]> {
  return (await getCollection('dicas')).sort(
    (a, b) => b.data.data_publicacao.getTime() - a.data.data_publicacao.getTime(),
  );
}

/** "Publicada hoje", "Publicada ontem", "Publicada há 5 dias"... */
export function publicadaHa(data: Date, agora = Date.now()): string {
  const dias = Math.max(0, Math.floor((agora - data.getTime()) / DIA_MS));
  if (dias === 0) return 'Publicada hoje';
  if (dias === 1) return 'Publicada ontem';
  if (dias < 30) return `Publicada há ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? 'Publicada há 1 mês' : `Publicada há ${meses} meses`;
}

export const dataPorExtenso = (d: Date) =>
  d.toLocaleDateString('pt-BR', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });

/** Texto sem acentos e em minúsculas, para a busca. */
export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const resumo = (texto: string, max = 140) =>
  texto.length <= max ? texto : texto.slice(0, max).replace(/\s+\S*$/, '') + '…';

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Descrição em HTML usada nos dados estruturados. Espelha exatamente o que a página mostra. */
export function descricaoHtml(v: Vaga): string {
  const { objetivo, funcao, requisitos, salario, beneficios } = v.data;
  const lista = (itens: string[]) => `<ul>${itens.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
  let html = `<h2>Objetivo da vaga</h2><p>${escapeHtml(objetivo)}</p>`;
  html += `<h2>Função e atividades</h2>${lista(funcao)}`;
  html += `<h2>Requisitos</h2>${lista(requisitos)}`;
  if (salario) html += `<h2>Salário</h2><p>${escapeHtml(salario)}</p>`;
  if (beneficios?.length) html += `<h2>Benefícios</h2>${lista(beneficios)}`;
  return html;
}

/** Objeto JSON-LD JobPosting (somente para vagas abertas). */
export function jobPostingJsonLd(v: Vaga) {
  const d = v.data;
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: d.titulo,
    description: descricaoHtml(v),
    datePosted: diaISO(d.data_publicacao),
    validThrough: fimDaVagaISO(v),
    hiringOrganization: { '@type': 'Organization', name: d.empresa },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: { '@type': 'Country', name: 'Brasil' },
    directApply: false,
  };
  if (d.salario_min || d.salario_max) {
    const min = d.salario_min ?? d.salario_max!;
    const max = d.salario_max ?? d.salario_min!;
    ld.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'BRL',
      value:
        min === max
          ? { '@type': 'QuantitativeValue', value: min, unitText: d.salario_periodo }
          : { '@type': 'QuantitativeValue', minValue: min, maxValue: max, unitText: d.salario_periodo },
    };
  }
  return ld;
}
