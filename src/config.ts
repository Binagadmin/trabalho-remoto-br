/**
 * CONFIGURAÇÃO CENTRAL DO SITE
 * Tudo que você precisa trocar antes de publicar está aqui.
 * (O endereço do site fica em astro.config.mjs, na constante SITE_URL.)
 */
export const site = {
  // Nome do site. Para mudar, troque só aqui: aparece no logo, títulos e páginas legais.
  nome: 'Trabalho Remoto BR',
  slogan: 'Vagas de emprego 100% home office',
  descricao:
    'Encontre vagas de emprego 100% home office no Brasil, com objetivo, atividades, requisitos, salário e benefícios descritos de forma clara.',

  // Endereço do site (vem do astro.config.mjs). Não precisa editar aqui.
  url: (import.meta.env.SITE ?? 'https://www.seudominio.com.br').replace(/\/$/, ''),

  // Contato público.
  email: 'sm19932012@gmail.com',
  // ID do formulário no Formspree (https://formspree.io): o final de https://formspree.io/f/SEU_ID
  formspreeId: 'SEU_ID_FORMSPREE',

  // Responsável pelo site (aparece nas páginas de privacidade e termos).
  responsavel: '[SEU NOME OU RAZÃO SOCIAL]',

  // GOOGLE ADSENSE ---------------------------------------------------------
  // Depois de criar sua conta, cole aqui o ID do editor (ex.: 'ca-pub-1234567890123456').
  // Enquanto estiver vazio, nenhum script do Google é carregado.
  adsenseClient: '',
  // ID do bloco de anúncio (data-ad-slot) usado nos <AdSlot />. Opcional:
  // sem ele, os blocos ficam vazios e você pode usar só os anúncios automáticos.
  adsenseSlot: '',
  // ------------------------------------------------------------------------

  // Data de atualização das páginas legais (atualize quando mudar os textos).
  atualizacaoLegal: '4 de novembro de 2026',
};

/** Quantas vagas por página em /vagas/ e quantas aparecem no início. */
export const VAGAS_POR_PAGINA = 10;
