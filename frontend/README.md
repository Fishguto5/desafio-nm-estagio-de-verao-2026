# Frontend

Frontend Next.js para um chatbot com IA que fornece respostas fundamentadas sobre o vestibular Unicamp 2026.

## Stack

- [**Node.js**](https://nodejs.org/) - Runtime JavaScript
  - [**pnpm**](https://pnpm.io/) - Gerenciador de pacotes rápido e eficiente
  - [**TypeScript**](https://www.typescriptlang.org/) - Tipagem estática para JavaScript
  - [**ESLint**](https://eslint.org/) - Lint de código
  - [**Prettier**](https://prettier.io/) - Formatação de código
- [**Next.js 15 App Router**](https://nextjs.org/docs) - Framework React
- [**AI SDK React**](https://ai-sdk.dev/docs/ai-sdk-ui/overview) - SDK React para IA
- [**shadcn/ui**](https://ui.shadcn.com/) - Componentes UI baseados em Radix UI e Tailwind CSS
  - [**Tailwind CSS**](https://tailwindcss.com/docs) - Framework CSS utilitário
- [**OpenAPI Generator (typescript-fetch)**](https://openapi-ts.dev/openapi-fetch/) - Geração de cliente via OpenAPI Generator
- [**Zod**](https://zod.dev/) - Validação de schemas TypeScript
- [**@t3-oss/env-nextjs**](https://env.t3.gg/) - Validação de variáveis de ambiente

Se você não estiver familiarizado com as diferentes tecnologias usadas neste projeto, consulte a documentação correspondente de cada uma.

## Pré-requisitos

- Node.js 20+
- pnpm

## Início Rápido

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Configure o ambiente (crie `.env` na raiz do frontend):

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   Ajuste a URL da API conforme necessário. Leia o conteúdo do arquivo `src/env.js` para mais informações sobre as variáveis de ambiente.

   **Nota:** Isso requer que a API backend esteja rodando e acessível na URL configurada em `NEXT_PUBLIC_API_URL`.

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Estrutura de Pastas

```
frontend/                                 # Raiz do frontend
├── src/                                  # Código-fonte da aplicação
│   ├── actions/                          # Server Actions
│   │   └── auth.ts                       # Server actions para autenticação
│   ├── app/                              # App Router do Next.js
│   │   ├── (auth)/                       # Grupo de rotas de autenticação
│   │   │   └── sign-in/                  # Página de login
│   │   ├── (chat)/                       # Grupo de rotas do chat
│   │   │   ├── chat/                     # Segmento de chat
│   │   │   │   └── [id]/                 # Rota dinâmica por ID de chat
│   │   │   │       └── page.tsx          # Página de chat por ID
│   │   │   ├── layout.tsx                # Layout de proteção do grupo de chat (redireciona para login)
│   │   │   ├── loading.tsx               # Loading do grupo de chat
│   │   │   └── page.tsx                  # Página principal do grupo de chat que cria chat e redireciona
│   │   ├── error.tsx                     # Página de erro
│   │   ├── layout.tsx                    # Layout raiz
│   │   ├── not-found.tsx                 # Página 404
│   │   └── page.tsx                      # Página inicial
│   ├── components/                       # Componentes reutilizáveis
│   │   ├── auth/                         # Componentes de autenticação
│   │   ├── ai/                           # Componentes relacionado a AI e chats
│   │   ├── ui/                           # Componentes UI (shadcn/ui)
│   │   ├── app.tsx                       # Componente raiz da aplicação
│   ├── contexts/                         # Contextos da aplicação
│   │   └── user-context.tsx              # Contexto de usuário
│   ├── hooks/                            # Hooks customizados
│   │   └── use-scroll-to-bottom.ts       # Custom hook para scroll automático no chat
│   ├── lib/                              # Utilitários
│   │   ├── api/                          # Utilitários para a API
│   │   │   ├── ai.ts                     # Funções utilitárias relacionadas a IA
│   │   │   └── auth.ts                   # Funções utilitárias relacionadas a autenticação
│   │   ├── api-client.gen/               # Cliente gerado (OpenAPI Generator)
│   │   ├── ui/                           # Utilitários de UI
│   │   ├── ai-sdk.ts                     # Configurações do AI SDK
│   │   ├── cn.ts                         # Utilitários do Shadcn
│   │   └── fastapi-client.ts             # Instâncias dos clients gerados
│   ├── styles/                           # Estilos globais
│   │   └── globals.css                   # Estilos base do app
│   └── env.ts                            # Validação de variáveis de ambiente
└── public/                               # Arquivos estáticos
    └── favicon.ico                       # Ícone do site
```

## Documentação

Os principais comandos de desenvolvimento estão no arquivo `package.json` e podem ser rodados usando `pnpm <comando>`. Alguns comandos úteis:

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Constrói a aplicação para produção
- `pnpm start` - Inicia o servidor de produção (após build)
- `pnpm preview` - Faz build e inicia o servidor de produção
- `pnpm lint` - Executa o linter
- `pnpm lint:fix` - Corrige problemas do linter automaticamente
- `pnpm format:check` - Verifica a formatação do código
- `pnpm format:write` - Formata o código
- `pnpm typecheck` - Verifica tipos TypeScript
- `pnpm check` - Executa lint e typecheck
- `pnpm test` - Executa os testes automatizados
- `pnpm apigen` - Gera o cliente da API a partir do OpenAPI do backend
- `pnpm up` - Inicia os serviços Docker
- `pnpm down` - Para os serviços Docker

**Notas**

- Reexecute `pnpm apigen` sempre que o backend for atualizado. O cliente gerado em `src/lib/api-client.gen` é substituído.
- O comando `pnpm apigen` lê `NEXT_PUBLIC_API_URL` do `.env` e usa o endpoint `${NEXT_PUBLIC_API_URL}/openapi.json`.

Caso queira mais detalhes sobre alguma tecnologia utilizada, consulte a documentação oficial correspondente.
