# 🛒 Site Vendas - BoostChat

Plataforma de vendas e gerenciamento de assinaturas para o BoostChat.

## 🚀 Stack Tecnológica

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização moderna e responsiva
- **Framer Motion** - Animações fluidas
- **Firebase Auth** - Autenticação de usuários
- **Firestore** - Banco de dados em tempo real
- **Stripe** - Processamento de pagamentos
- **Socket.IO Client** - Comunicação em tempo real com chatbot

## 📁 Estrutura do Projeto

```
site-vendas/
├── app/
│   ├── page.tsx              # Landing page
│   ├── pricing/              # Página de preços
│   ├── dashboard/            # Dashboard do usuário
│   ├── chat/                 # Interface de chat
│   ├── checkout/             # Checkout e pagamento
│   └── api/                  # API routes
├── lib/
│   ├── firebase/
│   │   ├── config.ts         # Configuração Firebase
│   │   └── auth.ts           # Funções de autenticação
│   ├── stripe/
│   │   └── config.ts         # Configuração Stripe
│   └── hooks/
│       ├── useAuth.ts        # Hook de autenticação
│       └── useUserUsage.ts   # Hook de uso do usuário
└── README.md
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- Conta Firebase com Auth e Firestore ativados
- Conta Stripe com API keys

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd site-vendas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais.

4. **Execute em modo desenvolvimento**
```bash
npm run dev
```

A aplicação estará rodando em `http://localhost:3000`

## 📱 Páginas Principais

- **Landing Page** (`/`) - Hero, features e preview dos planos
- **Pricing** (`/pricing`) - Lista completa dos planos e FAQ
- **Dashboard** (`/dashboard`) - Visão geral do plano e estatísticas
- **Chat** (`/chat`) - Interface de chat em tempo real
- **Checkout** (`/checkout`) - Processamento de pagamento

## 🔌 Integração com Chatbot Core

### WebSocket (Chat em Tempo Real)
```javascript
const socket = io(CHATBOT_API_URL, {
  query: { userId: user.uid }
});

socket.emit('sendMessage', {
  userId: user.uid,
  message: 'Olá!'
});
```

### REST API
```javascript
// Obter uso do usuário
GET /user/:userId/usage
```

### Webhook (Atualização de Planos)
```javascript
POST /plans/webhook
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npx vercel
```

Configure as variáveis de ambiente no dashboard do Vercel.

## 📄 Licença

MIT

---

Desenvolvido com ❤️ pelo time BoostChat
