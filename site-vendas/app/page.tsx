'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BoostChat
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                  >
                    Planos
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Começar Grátis
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Chatbot Inteligente com
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}IA Humanizada
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Converse com um assistente virtual que entende suas necessidades,
              responde de forma natural e mantém o contexto de suas conversas.
              Powered by GPT-4. 🚀
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-lg bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
              >
                Ver Planos
              </Link>
              {user && (
                <Link
                  href="/chat"
                  className="px-8 py-4 rounded-lg bg-white text-blue-600 text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition transform hover:scale-105"
                >
                  Começar Conversa
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o BoostChat?
            </h3>
            <p className="text-xl text-gray-600">
              Tecnologia de ponta para uma experiência conversacional única
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="IA Humanizada"
              description="Respostas naturais e empáticas que criam uma conexão genuína"
            />
            <FeatureCard
              icon="💬"
              title="Chat em Tempo Real"
              description="WebSocket para conversas fluidas e instantâneas"
            />
            <FeatureCard
              icon="🧠"
              title="Memória Contextual"
              description="O chatbot lembra do histórico e contexto das suas conversas"
            />
            <FeatureCard
              icon="🔒"
              title="Seguro e Privado"
              description="Seus dados protegidos com criptografia de ponta a ponta"
            />
            <FeatureCard
              icon="⚡"
              title="Super Rápido"
              description="Respostas em segundos com infraestrutura escalável"
            />
            <FeatureCard
              icon="📊"
              title="Analytics"
              description="Acompanhe seu uso e histórico de conversas"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Planos para todos os perfis
          </h3>
          <p className="text-xl text-gray-600 mb-12">
            Escolha o plano ideal para suas necessidades
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <PricingCard
              name="Básico"
              price={50}
              messages="300 mensagens/mês"
              features={['Respostas humanizadas', 'Histórico de conversas', 'Suporte por email']}
            />
            <PricingCard
              name="Profissional"
              price={250}
              messages="2.500 mensagens/mês"
              features={[
                'Tudo do Básico',
                'Chat em tempo real',
                'Memória contextual avançada',
                'Suporte prioritário',
              ]}
              popular
            />
            <PricingCard
              name="Ilimitado"
              price={400}
              messages="Mensagens ilimitadas"
              features={[
                'Tudo do Profissional',
                'API de integração',
                'Suporte 24/7',
                'Análises avançadas',
              ]}
            />
          </div>
          <Link
            href="/pricing"
            className="inline-block px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Ver Todos os Planos
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">BoostChat</h2>
          <p className="text-gray-400 mb-4">
            Chatbot inteligente com IA humanizada para impulsionar suas conversas
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 BoostChat. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function PricingCard({
  name,
  price,
  messages,
  features,
  popular,
}: {
  name: string;
  price: number;
  messages: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition ${
        popular ? 'ring-4 ring-blue-600' : ''
      }`}
    >
      {popular && (
        <div className="text-center mb-4">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Mais Popular
          </span>
        </div>
      )}
      <h4 className="text-2xl font-bold text-gray-900 mb-2">{name}</h4>
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900">R$ {price}</span>
        <span className="text-gray-600">/mês</span>
      </div>
      <p className="text-gray-600 mb-6">{messages}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
