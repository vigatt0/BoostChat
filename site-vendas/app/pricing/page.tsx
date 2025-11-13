'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { PLAN_TIERS } from '@/lib/stripe/config';

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      router.push(`/pricing?plan=${planId}&redirect=checkout`);
      return;
    }
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BoostChat
              </h1>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-gray-900 transition">
                Início
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Começar
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-gray-600">
              Todos os planos incluem IA humanizada e respostas empáticas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLAN_TIERS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl bg-white shadow-xl ${
                  plan.popular ? 'ring-4 ring-blue-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">R$ {plan.price}</span>
                    <span className="text-gray-600 text-lg">/mês</span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {plan.isUnlimited ? 'Mensagens ilimitadas' : `${plan.messages} mensagens/mês`}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-green-500 text-xl mr-3">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Selecionar Plano
                </button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Perguntas Frequentes
            </h3>
            <div className="space-y-6">
              <FAQItem
                question="Como funciona o sistema de mensagens?"
                answer="Cada plano oferece um número específico de mensagens por mês. Uma mensagem é contada quando você envia uma pergunta ao chatbot e recebe uma resposta."
              />
              <FAQItem
                question="Posso mudar de plano a qualquer momento?"
                answer="Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente."
              />
              <FAQItem
                question="O que acontece se eu atingir o limite de mensagens?"
                answer="Você receberá uma notificação quando estiver próximo do limite. Você pode fazer upgrade do plano ou aguardar a renovação mensal."
              />
              <FAQItem
                question="Posso cancelar minha assinatura?"
                answer="Sim, você pode cancelar sua assinatura a qualquer momento. Você continuará tendo acesso até o final do período já pago."
              />
            </div>
          </motion.div>
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-6 rounded-lg bg-white shadow-md">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{question}</h4>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
