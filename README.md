Angola B2B
Onde as empresas encontram negócios.
Plataforma angolana de descoberta e geração de negócios B2B: diretório de empresas pesquisável, publicação de pedidos de orçamento (RFQ) e um mecanismo de ligação manual entre procura e oferta, como primeiro passo antes de um futuro matchmaking automático.
> Documentação gerada a reflectir o estado do projecto em Setembro de 2026 (fim da V3 — núcleo transacional).
---
Evolução do produto
Versão	Descrição	Estado
V0	Protótipo leve de validação (página estática, formulários via WhatsApp, sem base de dados)	Concluído — usado para validar procura antes de investir em código
V3	Núcleo transacional: login, registo de empresas, diretório, pedidos, painel de gestão	Em curso — este documento descreve este estado
V4	Pagamentos e créditos, planos pagos, selo de empresa verificada	Planeado
V5	Matchmaking automático e intermediação activa	Planeado
---
Stack tecnológica
Camada	Tecnologia
Framework	Next.js 16 (App Router, Turbopack)
Linguagem	TypeScript + React 19
Estilo	Tailwind CSS
Base de dados	PostgreSQL, alojada na Supabase
ORM	Prisma (gerador `prisma-client`, engine `classic`)
Autenticação	Supabase Auth, via `@supabase/ssr`
Armazenamento de ficheiros	Supabase Storage (logótipos de empresas)
Envio de emails	SMTP próprio via Resend
Alojamento previsto	Vercel (aplicação) + Cloudflare (DNS/CDN)
---
Estrutura do projecto
```
src/
├─ app/
│  ├─ page.tsx                    → Homepage (hero, pesquisa, categorias, empresas em destaque)
│  ├─ proxy.ts                    → Middleware de sessão e proteção de rotas
│  │                                  (Next.js 16 renomeou "middleware.ts" para "proxy.ts")
│  ├─ login/
│  │  ├─ page.tsx                 → Formulário de entrar/registar
│  │  └─ actions.ts               → Server Actions: login, signup, logout
│  ├─ dashboard/
│  │  └─ page.tsx                 → Área autenticada genérica
│  ├─ empresa/                    → Área PRIVADA de acções sobre uma empresa
│  │  └─ nova/
│  │     ├─ page.tsx              → Formulário de registo de empresa
│  │     └─ actions.ts            → Cria o registo, faz upload do logótipo
│  ├─ empresas/                   → Diretório PÚBLICO (nome no plural, propositadamente
│  │  │                              diferente de "empresa/", que é privado)
│  │  ├─ page.tsx                 → Listagem com pesquisa, filtros e paginação
│  │  ├─ loading.tsx              → Esqueleto de carregamento
│  │  └─ [slug]/
│  │     └─ page.tsx              → Perfil público de uma empresa (SEO-friendly)
│  ├─ pedidos/
│  │  ├─ novo/
│  │  │  ├─ page.tsx              → Publicar pedido (RFQ) — público, sem login
│  │  │  └─ actions.ts            → Cria o pedido; liga à conta se houver sessão
│  │  └─ consultar/
│  │     └─ page.tsx              → Consulta de pedidos (por conta, ou por WhatsApp se anónimo)
│  └─ admin/
│     └─ pedidos/
│        ├─ page.tsx              → Painel de gestão (acesso restrito a ADMIN_EMAIL)
│        └─ actions.ts            → Actualiza o estado de um pedido
├─ lib/
│  ├─ prisma.ts                   → Cliente Prisma singleton (evita esgotar ligações em dev)
│  └─ categorias.ts               → Lista central de categorias (usada em todos os formulários)
├─ utils/supabase/
│  ├─ client.ts                   → Cliente Supabase para Client Components
│  ├─ server.ts                   → Cliente Supabase para Server Components / Actions
│  └─ middleware.ts               → Lógica de renovação de sessão, usada pelo proxy.ts
└─ generated/prisma/              → Prisma Client gerado (NÃO versionado — ver .gitignore)

prisma/
├─ schema.prisma
├─ migrations/
└─ seed.ts                        → Gera 35 empresas fictícias para testar paginação/pesquisa
```
---
Modelo de dados
`Company` — perfil de empresa: `nome`, `slug` (único, para o URL público), `categoria`, `localizacao`, `descricao`, `whatsapp`, `email`, `website`, `logoUrl` (caminho no Storage, não o URL completo), `verificada`, `authUserId` (dono da conta).
`Pedido` — pedido de orçamento (RFQ): `descricao`, `categoria`, `localizacao`, `prazo`, `nome`, `contacto`, `estado`, `authUserId` (opcional — nulo se publicado sem conta).
Enums:
`Categoria` — Construção, Tecnologia, Marketing & Design, Logística, Consultoria, Comércio, Indústria, Serviços profissionais, Hotelaria, Agricultura, Outra
`EstadoPedido` — Novo, Contactado, Em negociação, Ganho, Perdido
---
Configuração do ambiente local
Pré-requisitos
Node.js (versão LTS — usar nvm-windows para gerir versões)
Conta Supabase (base de dados, autenticação, storage)
Conta Resend (envio de emails de autenticação)
Variáveis de ambiente (`.env`, nunca commitado)
```dotenv
# Prisma — ligação à Supabase
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<regiao>.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-<regiao>.pooler.supabase.com:5432/postgres"

# Supabase client
NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."

# Painel de administração
ADMIN_EMAIL="teu-email-de-operador@exemplo.com"
```
Instalação e arranque
```powershell
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```
Aplicação disponível em `http://localhost:3000`.
---
Funcionalidades da V3
[x] Autenticação — login, registo, logout, sessão renovada via `proxy.ts`
[x] Registo de empresa — formulário com upload de logótipo para Supabase Storage
[x] Diretório público — pesquisa por texto, filtro por categoria/localização, paginação
[x] Perfil público de empresa — página indexável em `/empresas/[slug]`, com metadata dinâmica
[x] Publicação de pedidos (RFQ) — sem exigir conta, para reduzir fricção do lado da procura
[x] Incentivo à criação de conta — após publicar um pedido anónimo, oferta de conta grátis que liga automaticamente esse pedido ao novo utilizador
[x] Consulta de pedidos — automática por conta, ou manual por WhatsApp se anónimo
[x] Painel de gestão interno — lista todos os pedidos, sugere empresas correspondentes com link directo para WhatsApp, permite mudar o estado
[x] Homepage integrada — hero, pesquisa, categorias e empresas em destaque ligados a dados reais
[x] Layout responsivo com Tailwind nas páginas públicas principais
Por fazer
[ ] Polimento visual dos formulários (`/empresa/nova`, `/pedidos/novo`, `/pedidos/consultar`, `/login`) e do painel de admin
[ ] Testes ponta-a-ponta do fluxo completo
[ ] Lançamento: deploy na Vercel + domínio próprio
[ ] V4 — planos pagos, sistema de créditos (inspirado na B2Brazil), selo de verificação, pagamentos via AppyPay/Multicaixa Express
[ ] V5 — matchmaking automático, intermediação activa
---
Decisões técnicas e particularidades a lembrar
Estas são as armadilhas já resolvidas durante o desenvolvimento — registadas para não se repetirem:
`middleware.ts` → `proxy.ts`: o Next.js 16 descontinuou a convenção `middleware.ts` a favor de `proxy.ts` (mesma lógica, nome da função exportada muda de `middleware` para `proxy`).
Import do Prisma Client: com o gerador `prisma-client` (não o antigo `prisma-client-js`), a classe `PrismaClient` vive em `@/generated/prisma/client`, não na raiz `@/generated/prisma`.
`DIRECT_URL` usa o Session Pooler, não a Direct Connection: a Direct Connection da Supabase só aceita IPv6, o que falha em muitas redes locais. O Session Pooler (porta 5432, via `pooler.supabase.com`) é compatível com IPv4.
Chave pública da Supabase: a nomenclatura mudou de "anon key" para "Publishable key" (`sb_publishable_...`); a variável de ambiente correspondente chama-se `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
`src/generated/prisma` não é versionado: é recriado por `prisma generate`/`migrate dev`; está no `.gitignore`.
`empresa/` vs `empresas/`: pastas irmãs propositadamente distintas — a primeira (singular) é a área privada de acções (ex: `empresa/nova`), a segunda (plural) é o diretório público.
`Pedido` é anónimo por padrão: só se liga a uma conta (`authUserId`) se o utilizador estiver autenticado ao submeter, ou criar conta logo a seguir através do incentivo mostrado no ecrã de sucesso.
Confirmação de email desligada em desenvolvimento: em Supabase, "Authentication → Providers → Email → Confirm email" está desactivado para agilizar testes — reactivar antes de haver utilizadores reais.
SMTP via Resend sem domínio verificado: o remetente `onboarding@resend.dev` só entrega emails à própria conta usada para criar a conta Resend. Antes do lançamento, verificar um domínio próprio no Resend para poder enviar a qualquer email.
---
Scripts úteis
```powershell
npx prisma studio        # Interface visual da base de dados (localhost:5555)
npx tsx prisma/seed.ts   # Cria 35 empresas fictícias para testar pesquisa e paginação
```
---
Autor
Sthino — github.com/SthinoIV