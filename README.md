# 🚀 BoostChat - Chatbot SaaS Platform

Plataforma completa de chatbot inteligente com IA humanizada, gerenciamento de assinaturas e chat em tempo real.

## 📋 Visão Geral

O BoostChat é uma solução SaaS completa que oferece um chatbot inteligente com processamento de linguagem natural (GPT-4), sistema de assinaturas com diferentes planos e interface de chat em tempo real.

### Arquitetura

O projeto é dividido em dois repositórios principais:

1. **chatbot-core** (Backend - NestJS)
   - API REST e WebSocket
   - Integração com GPT-4 via LangChain
   - Gerenciamento de sessões com Redis
   - Persistência com Firestore
   - Controle de limites de mensagens por plano

2. **site-vendas** (Frontend - Next.js)
   - Landing page e páginas de preços
   - Sistema de autenticação (Firebase Auth)
   - Integração com Stripe para pagamentos
   - Dashboard do usuário
   - Interface de chat em tempo real

## 🛠️ Stack Tecnológica

### Backend (chatbot-core)
- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **LangChain + OpenAI GPT-4** - IA conversacional
- **Firebase Firestore** - Banco de dados
- **Redis** - Cache e sessões
- **Socket.IO** - WebSocket para tempo real

### Frontend (site-vendas)
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Framer Motion** - Animações
- **Firebase Auth** - Autenticação
- **Stripe** - Pagamentos
- **Socket.IO Client** - Chat em tempo real

## 📦 Planos Oferecidos

| Plano | Preço | Mensagens | Recursos |
|-------|-------|-----------|----------|
| **Básico** | R$ 50/mês | 300 mensagens | Respostas humanizadas, Histórico, Suporte email |
| **Profissional** | R$ 250/mês | 2.500 mensagens | Tudo do Básico + Chat tempo real, Memória contextual, Suporte prioritário |
| **Ilimitado** | R$ 400/mês | Ilimitado | Tudo do Pro + API de integração, Suporte 24/7, Analytics avançado |

## 🚀 Instalação Rápida com Docker Compose

A forma mais rápida de executar todo o sistema localmente:

### Pré-requisitos

- Docker e Docker Compose instalados
- Conta OpenAI com API key
- Conta Firebase (projeto configurado)
- Conta Stripe (opcional para testes)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/vigatt0/BoostChat.git
cd BoostChat
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais reais:
- OpenAI API Key
- Firebase Service Account (backend) e Config (frontend)
- Stripe Keys (opcional para testes de pagamento)

3. **Inicie todos os serviços**
```bash
docker-compose up -d
```

Isso iniciará:
- Redis (porta 6379)
- Chatbot Core (porta 3001)
- Site Vendas (porta 3000)

4. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔧 Instalação Manual

Se preferir rodar os serviços separadamente:

### 1. Chatbot Core (Backend)

```bash
cd chatbot-core
npm install
cp .env.example .env
# Configure o .env com suas credenciais
npm run start:dev
```

### 2. Site Vendas (Frontend)

```bash
cd site-vendas
npm install
cp .env.example .env.local
# Configure o .env.local com suas credenciais
npm run dev
```

### 3. Redis (opcional para desenvolvimento)

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

## 📡 Endpoints da API

### Chatbot Core (http://localhost:3001)

#### Chat
- `POST /chat/send` - Envia mensagem para o chatbot
- `POST /chat/clear` - Limpa histórico de conversação

#### Usuário
- `GET /user/:userId/usage` - Obtém estatísticas de uso

#### Planos
- `POST /plans/webhook` - Webhook para atualização de planos
- `GET /plans/:userId` - Obtém detalhes do plano

#### WebSocket
- Conexão: `ws://localhost:3001?userId=<userId>`
- Eventos: `sendMessage`, `messageReceived`, `typing`, `clearConversation`

## 🔌 Fluxo de Integração

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│             │ WebSocket│              │         │            │
│ site-vendas ├────────►│ chatbot-core │────────►│ OpenAI GPT │
│  (Next.js)  │         │   (NestJS)   │         │            │
│             │◄────────┤              │◄────────┤            │
└─────┬───────┘   REST  └──────┬───────┘         └────────────┘
      │                        │
      │                        │
      ▼                        ▼
┌────────────┐          ┌─────────────┐
│  Firebase  │          │    Redis    │
│  (Auth +   │          │  (Cache +   │
│ Firestore) │          │  Sessions)  │
└────────────┘          └─────────────┘
      │
      │ Webhook
      ▼
┌─────────────┐
│   Stripe    │
│ (Pagamento) │
└─────────────┘
```

### Fluxo de Compra de Plano

1. Usuário seleciona plano no site-vendas
2. Stripe processa o pagamento
3. Webhook do Stripe notifica site-vendas
4. Site-vendas atualiza Firestore
5. Site-vendas notifica chatbot-core via webhook
6. Chatbot-core atualiza limite de mensagens
7. Usuário pode começar a usar o chatbot

## 🔐 Configuração de Segurança

### Firebase Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /conversations/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Configuração de CORS

O chatbot-core já está configurado para aceitar requisições do site-vendas. Para produção, atualize a variável `ALLOWED_ORIGINS` no `.env`.

## 🚀 Deploy em Produção

### Chatbot Core

#### Google Cloud Run
```bash
cd chatbot-core
gcloud builds submit --tag gcr.io/[PROJECT-ID]/chatbot-core
gcloud run deploy chatbot-core \
  --image gcr.io/[PROJECT-ID]/chatbot-core \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Heroku
```bash
cd chatbot-core
heroku create boostchat-core
git push heroku main
```

### Site Vendas

#### Vercel (Recomendado)
```bash
cd site-vendas
npx vercel
```

Configure as variáveis de ambiente no dashboard do Vercel.

#### Netlify
```bash
cd site-vendas
netlify deploy --prod
```

## 📊 Monitoramento e Logs

### Chatbot Core
- Logs são enviados para stdout
- Integre com Google Cloud Logging, Datadog ou Sentry

### Site Vendas
- Next.js Analytics (Vercel)
- Google Analytics (adicionar conforme necessário)

## 🧪 Testes

```bash
# Chatbot Core
cd chatbot-core
npm test

# Site Vendas
cd site-vendas
npm test
```

## 📝 Estrutura de Diretórios

```
BoostChat/
├── chatbot-core/          # Backend NestJS
│   ├── src/
│   │   ├── chat/          # Módulo de chat
│   │   ├── user/          # Módulo de usuários
│   │   ├── plans/         # Módulo de planos
│   │   ├── websocket/     # Módulo WebSocket
│   │   └── config/        # Serviços de configuração
│   ├── Dockerfile
│   └── README.md
│
├── site-vendas/           # Frontend Next.js
│   ├── app/
│   │   ├── page.tsx       # Landing page
│   │   ├── pricing/       # Página de preços
│   │   ├── dashboard/     # Dashboard
│   │   └── chat/          # Interface de chat
│   ├── lib/
│   │   ├── firebase/      # Config Firebase
│   │   ├── stripe/        # Config Stripe
│   │   └── hooks/         # React hooks
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml     # Orquestração Docker
├── .env.example           # Exemplo de variáveis
└── README.md             # Este arquivo
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

Para suporte, entre em contato via:
- Email: support@boostchat.com.br
- GitHub Issues: https://github.com/vigatt0/BoostChat/issues

## 🙏 Agradecimentos

- OpenAI pela API do GPT-4
- Firebase pela infraestrutura
- Stripe pelo sistema de pagamentos
- Comunidade open-source

---

Desenvolvido com ❤️ pelo time BoostChat
