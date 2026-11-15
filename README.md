# Site de vagas home office

Site estático feito com [Astro](https://astro.build), pronto para publicar na Cloudflare Pages.
Não tem banco de dados nem plugins: cada **vaga** é um arquivo de texto e cada **artigo** também.

> **Antes de publicar:** apague as 6 vagas de exemplo (`src/content/vagas/exemplo-*.md`). Elas são fictícias, com empresas inventadas e links de teste. Publicar vagas falsas pode reprovar o site no AdSense e prejudicar quem procura emprego.

---

## 1. Primeiros passos

Você precisa do [Node.js](https://nodejs.org) versão 18.20 ou mais nova.

```bash
npm install        # instala as dependências (só na primeira vez)
npm run dev        # abre o site em http://localhost:4321 para você conferir
npm run build      # gera o site final na pasta dist/
```

## 2. O que trocar antes de publicar

| O que | Onde |
|---|---|
| Endereço do site (ex.: `https://www.meusite.com.br`) | `astro.config.mjs`, constante `SITE_URL` |
| Nome do site, e-mail, ID do Formspree, responsável legal | `src/config.ts` |
| ID do Google AdSense (depois da aprovação) | `src/config.ts`, campo `adsenseClient` |
| Cores | `src/styles/global.css`, variáveis no topo (`:root`) |

O nome do site (hoje `Trabalho Remoto BR`) aparece no logo, nos títulos e nas páginas legais. Trocando em `src/config.ts`, ele muda em todo o site.

**Formulário de contato:** crie uma conta gratuita em [formspree.io](https://formspree.io), crie um formulário e copie o final do endereço (`https://formspree.io/f/AQUI`) para `formspreeId` em `src/config.ts`.

**Páginas legais:** os textos de Privacidade, Termos e Cookies são um ponto de partida, adequados a um site simples com AdSense. Preencha `responsavel` em `src/config.ts` e, se puder, peça a revisão de um(a) advogado(a).

---

## 3. Como adicionar uma vaga

1. Abra a pasta `src/content/vagas/`.
2. Copie o arquivo `_MODELO.md` e dê um novo nome, **em minúsculas, sem acentos e sem espaços**, ligando as palavras com hífen. Exemplo: `analista-de-rh-empresa-x.md`. O nome vira o endereço da vaga: `/vaga/analista-de-rh-empresa-x/`.
3. Preencha os campos. O modelo tem um comentário explicando cada um.
4. Salve e publique (seção 6).

Campos:

| Campo | Obrigatório | Observação |
|---|---|---|
| `titulo`, `empresa` | sim | |
| `area` | sim | Exatamente: Administrativo, Atendimento ao Cliente, Tecnologia, Marketing, Vendas, RH, Financeiro ou Design |
| `objetivo` | sim | Por que a empresa está contratando |
| `funcao` | sim | Lista de atividades |
| `requisitos` | sim | Lista |
| `salario` | não | Texto livre, ex.: `"R$ 4.500 a R$ 5.500 por mês"` |
| `salario_min`, `salario_max`, `salario_periodo` | não | Números para o Google Vagas. Devem bater com o texto do `salario` |
| `beneficios` | não | Lista |
| `link_candidatura` | sim | Endereço completo, com `https://` |
| `data_publicacao`, `data_expiracao` | sim | Formato `AAAA-MM-DD` |

**Dicas de escrita:** coloque entre aspas qualquer texto que tenha dois-pontos, comece com `R$`, `%` ou `#`. Se o site der erro no build, a mensagem diz qual arquivo e qual campo estão errados.

### Vagas que expiram

Depois do dia de `data_expiracao`, a vaga:

- some das listas, das áreas, da busca e do sitemap;
- continua acessível pelo link, mostrando **"Vaga encerrada"**, sem botão de candidatura e sem dados estruturados do Google.

Isso acontece de duas formas: na hora do build e também no navegador do visitante (um script pequeno esconde na hora as vagas vencidas). Para o Google parar de mostrar a vaga rápido, configure a atualização diária (seção 7).

Para remover uma vaga antes do prazo, apague o arquivo.

## 4. Como adicionar um artigo (Dicas)

1. Abra `src/content/dicas/` e copie um artigo existente.
2. Renomeie o arquivo (minúsculas, sem acentos, com hífens). O nome vira o endereço: `/dicas/nome-do-arquivo/`.
3. Edite o cabeçalho (`titulo`, `descricao`, `data_publicacao`) e escreva o texto em Markdown abaixo da segunda linha `---`:
   `## Título de seção`, `- item de lista`, `**negrito**`, `[texto](endereço)`.
4. Publique.

Para o AdSense, escreva artigos **originais**, com 500 palavras ou mais, úteis para quem procura emprego. Evite copiar de outros sites.

---

## 5. Anúncios (Google AdSense)

As vagas têm dois espaços `<AdSlot />`: um depois de **Requisitos** e outro depois de **Salário e benefícios**. O botão **Quero me candidatar** fica no fim da página, separado dos anúncios por um aviso de segurança e por um divisor.

> Regra do Google: não coloque anúncios perto de botões, links ou menus, porque isso pode causar cliques acidentais e levar a violação de política. Por isso, **não mova** o `<AdSlot />` para junto do botão de candidatura nem do menu.

Como ativar:

1. Crie sua conta em [adsense.google.com](https://adsense.google.com) e adicione o site.
2. Em `src/config.ts`, preencha `adsenseClient` com o ID do editor (`ca-pub-...`). O script do AdSense passa a ser carregado e o Google consegue verificar o site.
3. Troque o conteúdo de `public/ads.txt` pela linha que o AdSense mostrar.
4. Depois da aprovação, crie um bloco de anúncios, copie o `data-ad-slot` para `adsenseSlot` em `src/config.ts` e publique. Os `<AdSlot />` passam a mostrar o anúncio. Se preferir, use apenas anúncios automáticos e deixe `adsenseSlot` vazio.

Enquanto o AdSense não está configurado, os espaços aparecem como uma caixa tracejada com o rótulo "Publicidade". Isso é só para você ver onde ficam.

**Evite:** clicar nos seus próprios anúncios, pedir cliques, colocar anúncios em pop-ups e usar outras redes de anúncio junto durante a análise.

### Checklist antes de pedir a aprovação

- [ ] Vagas de exemplo apagadas e pelo menos 15 a 20 vagas reais publicadas
- [ ] 6 a 10 artigos originais em Dicas (já vêm 3)
- [ ] Nome do site, e-mail, responsável e Formspree preenchidos
- [ ] Domínio próprio, com HTTPS (a Cloudflare faz isso sozinha)
- [ ] Todas as páginas abrem e nenhum link está quebrado
- [ ] Site enviado ao Google Search Console, com o sitemap
- [ ] Páginas de Privacidade, Termos, Cookies, Sobre e Contato revisadas

---

## 6. Como publicar (Cloudflare Pages)

1. Crie um repositório no [GitHub](https://github.com) e envie esta pasta para ele.
2. Na Cloudflare, vá em **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
3. Configure:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Variável de ambiente:** `NODE_VERSION` = `22`
4. Clique em **Save and Deploy**. O site fica disponível em um endereço `*.pages.dev`.
5. Em **Custom domains**, conecte seu domínio. Lembre de ajustar `SITE_URL` em `astro.config.mjs`.

**Para atualizar o site** (nova vaga, novo artigo, mudança de texto): edite os arquivos, envie para o GitHub (pelo site do GitHub dá para criar e editar arquivos sem instalar nada) e a Cloudflare publica sozinha em cerca de 1 minuto.

## 7. Atualização diária (vagas que expiram)

Como o site é estático, quem faz a limpeza das vagas vencidas é um novo build. Para automatizar:

1. Na Cloudflare Pages: **Settings → Builds & deployments → Deploy hooks → Add**. Copie o endereço gerado.
2. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**, com nome `CLOUDFLARE_DEPLOY_HOOK` e o endereço como valor.
3. O arquivo `.github/workflows/rebuild-diario.yml` já faz o resto: todo dia às 3h (Brasília) ele reconstrói o site.

## 8. Google Search Console e Google Vagas

1. Cadastre o site em [search.google.com/search-console](https://search.google.com/search-console).
2. Envie o sitemap: `https://seu-site/sitemap.xml`.
3. Cada vaga aberta tem dados estruturados `JobPosting` (trabalho remoto, Brasil), o que permite aparecer no Google Vagas. Teste uma vaga em [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
4. Regras do Google que o site já segue: dados estruturados só na página de cada vaga, informações iguais às visíveis na página e remoção das vagas expiradas.

---

## 9. Estrutura do projeto

```
src/
  config.ts                 Nome, e-mail, AdSense, Formspree
  content.config.ts         Regras dos campos das vagas e dos artigos
  content/vagas/            Uma vaga por arquivo (_MODELO.md é o modelo)
  content/dicas/            Um artigo por arquivo
  layouts/Layout.astro      Cabeçalho, SEO, rodapé
  components/               Menu, rodapé, card de vaga, anúncio, paginação
  pages/                    Todas as páginas do site
  styles/global.css         Visual (cores e tamanhos nas variáveis)
public/                     favicon, imagem de compartilhamento, ads.txt, _headers
```

## 10. Problemas comuns

- **O build deu erro citando um arquivo de vaga:** o campo indicado está faltando ou com formato errado (data fora de `AAAA-MM-DD`, área escrita diferente, texto com dois-pontos sem aspas).
- **A vaga não aparece:** confira se `data_expiracao` não já passou e se o nome do arquivo não começa com `_`.
- **O formulário não envia:** confira o `formspreeId` e confirme o e-mail na conta do Formspree.
- **Os anúncios não aparecem:** a conta precisa estar aprovada e o `adsenseClient` preenchido. Depois da aprovação, pode levar algumas horas.
