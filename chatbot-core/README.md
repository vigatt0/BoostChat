# 🤖 Chatbot Core - BoostChat

Backend do sistema de chatbot inteligente com IA usando NestJS, LangChain e GPT.

## 🚀 Stack Tecnológica

- **NestJS** - Framework Node.js moderno e escalável
- **TypeScript** - Tipagem estática e melhor DX
- **LangChain + OpenAI GPT** - IA conversacional e processamento de linguagem natural
- **Firebase Firestore** - Banco de dados NoSQL para persistência
- **Redis** - Cache e gerenciamento de sessões
- **Socket.IO** - WebSocket para comunicação em tempo real
- **Pinecone** (opcional) - Memória vetorial para contexto avançado

## 📁 Estrutura do Projeto

```
chatbot-core/
├── src/
│   ├── chat/              # Módulo de chat e integração com IA
│   │   ├── chat.controller.ts
│   │   ├── chat.service.ts
│   │   ├── chat.module.ts
│   │   ├── langchain.service.ts
│   │   └── dto/
│   ├── user/              # Módulo de usuários e uso
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   └── dto/
│   ├── plans/             # Módulo de planos e webhook
│   │   ├── plans.controller.ts
│   │   ├── plans.service.ts
│   │   ├── plans.module.ts
│   │   └── dto/
│   ├── websocket/         # Módulo WebSocket para chat real-time
│   │   ├── chat.gateway.ts
│   │   └── websocket.module.ts
│   ├── config/            # Serviços de configuração
│   │   ├── firebase.service.ts
│   │   └── redis.service.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
├── nest-cli.json
├── Dockerfile
└── README.md
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- Redis (local ou remoto)
- Conta Firebase com Firestore ativado
- API Key da OpenAI

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd chatbot-core
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
PORT=3001
OPENAI_API_KEY=sk-...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
REDIS_HOST=localhost
REDIS_PORT=6379
```

4. **Execute em modo desenvolvimento**
```bash
npm run start:dev
```

A aplicação estará rodando em `http://localhost:3001`

## 📡 Endpoints da API

### Chat

#### `POST /chat/send`
Envia uma mensagem para o chatbot.

**Body:**
```json
{
  "userId": "user123",
  "message": "Olá, como você está?",
  "conversationId": "conv-456" // opcional
}
```

**Response:**
```json
{
  "conversationId": "conv-456",
  "response": "Olá! Estou ótimo, obrigado por perguntar! 😊 Como posso te ajudar hoje?",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "remainingMessages": 299
}
```

#### `POST /chat/clear`
Limpa o histórico de conversação de um usuário.

**Body:**
```json
{
  "userId": "user123"
}
```

### Usuário

#### `GET /user/:userId/usage`
Obtém informações de uso do usuário.

**Response:**
```json
{
  "userId": "user123",
  "plan": "pro",
  "messageBalance": 2450,
  "totalMessagesUsed": 50,
  "isUnlimited": false,
  "lastMessageAt": "2024-01-15T10:30:00.000Z"
}
```

### Planos

#### `POST /plans/webhook`
Webhook para atualizar plano do usuário (chamado pelo site-vendas).

**Body:**
```json
{
  "userId": "user123",
  "plan": "pro",
  "messageLimit": 2500,
  "isUnlimited": false,
  "stripeSubscriptionId": "sub_123",
  "email": "user@example.com"
}
```

#### `GET /plans/:userId`
Obtém detalhes do plano do usuário.

## 🔌 WebSocket

### Conexão

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  query: { userId: 'user123' }
});

socket.on('connected', (data) => {
  console.log(data.message); // "Conectado ao chat em tempo real! 🚀"
});
```

### Eventos

#### `sendMessage`
Envia mensagem via WebSocket.

```javascript
socket.emit('sendMessage', {
  userId: 'user123',
  message: 'Olá!'
});
```

#### `messageReceived`
Recebe resposta do bot.

```javascript
socket.on('messageReceived', (data) => {
  console.log(data.message);
  console.log('Mensagens restantes:', data.remainingMessages);
});
```

#### `typing`
Indica que o bot está "digitando".

```javascript
socket.on('typing', (data) => {
  console.log('Bot digitando:', data.isTyping);
});
```

## 🐳 Docker

### Build da imagem

```bash
docker build -t chatbot-core .
```

### Executar container

```bash
docker run -p 3001:3001 --env-file .env chatbot-core
```

## 🚀 Deploy

### Google Cloud Run

1. **Build e push da imagem**
```bash
gcloud builds submit --tag gcr.io/[PROJECT-ID]/chatbot-core
```

2. **Deploy no Cloud Run**
```bash
gcloud run deploy chatbot-core \
  --image gcr.io/[PROJECT-ID]/chatbot-core \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=sk-...
```

### Heroku

```bash
heroku create chatbot-core-app
heroku config:set OPENAI_API_KEY=sk-...
git push heroku main
```

## 🧪 Testes

```bash
# Rodar testes
npm test

# Rodar testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov
```

## 📝 Lint e Formatação

```bash
# Lint
npm run lint

# Formatação com Prettier
npm run format
```

## 🔐 Segurança

- **CORS**: Configurado para aceitar apenas origens permitidas
- **Validação**: DTOs validados automaticamente com class-validator
- **Webhook Secret**: Validação de webhook com secret compartilhado
- **Rate Limiting**: Controle de taxa de requisições (recomendado implementar)

## 📊 Monitoramento e Logs

Os logs são enviados para o console. Para produção, recomenda-se integrar com:
- **Google Cloud Logging**
- **Datadog**
- **Sentry** para tracking de erros

## 🤝 Integração com Site-Vendas

O chatbot-core recebe webhooks do site-vendas quando:
1. Um usuário compra um plano
2. Um plano é renovado ou cancelado
3. O limite de mensagens precisa ser atualizado

**Endpoint:** `POST /plans/webhook`

## 📚 Documentação Adicional

- [NestJS Documentation](https://docs.nestjs.com/)
- [LangChain Documentation](https://js.langchain.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## 📄 Licença

MIT

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

Desenvolvido com ❤️ pelo time BoostChat
