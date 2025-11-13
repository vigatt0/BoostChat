'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserUsage } from '@/lib/hooks/useUserUsage';
import { signOut } from '@/lib/firebase/auth';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { usage, loading: usageLoading } = useUserUsage(user?.uid || null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/pricing');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || usageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const messagePercentage = usage?.isUnlimited
    ? 100
    : ((usage?.messageBalance || 0) / (usage?.messageBalance || 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BoostChat
              </h1>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/chat"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Abrir Chat
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta! 👋
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Plano Atual"
              value={usage?.plan || 'Free'}
              icon="💎"
              subtitle={usage?.isUnlimited ? 'Ilimitado' : 'Com limite'}
            />
            <StatCard
              title="Mensagens Restantes"
              value={usage?.isUnlimited ? '∞' : (usage?.messageBalance || 0).toString()}
              icon="💬"
              subtitle={usage?.isUnlimited ? 'Sem limites' : 'mensagens disponíveis'}
            />
            <StatCard
              title="Total Usado"
              value={(usage?.totalMessagesUsed || 0).toString()}
              icon="📊"
              subtitle="mensagens enviadas"
            />
          </div>

          {/* Usage Bar */}
          {!usage?.isUnlimited && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Uso de Mensagens</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${messagePercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {usage?.messageBalance || 0} de {usage?.messageBalance || 0} mensagens disponíveis
              </p>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <ActionButton
                href="/chat"
                icon="💬"
                title="Iniciar Conversa"
                description="Comece a usar o chatbot agora"
              />
              <ActionButton
                href="/pricing"
                icon="⚡"
                title="Fazer Upgrade"
                description="Veja nossos planos"
              />
              <ActionButton
                href="#"
                icon="📜"
                title="Ver Histórico"
                description="Suas conversas anteriores"
                onClick={() => alert('Funcionalidade em desenvolvimento')}
              />
            </div>
          </motion.div>

          {/* Plan Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-2">
              {usage?.isUnlimited ? 'Você tem acesso ilimitado!' : 'Precisa de mais mensagens?'}
            </h3>
            <p className="mb-6">
              {usage?.isUnlimited
                ? 'Aproveite todas as funcionalidades sem limites!'
                : 'Faça upgrade para enviar mais mensagens e ter acesso a recursos exclusivos.'}
            </p>
            {!usage?.isUnlimited && (
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Ver Planos
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: string;
  subtitle: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </motion.div>
  );
}

function ActionButton({
  href,
  icon,
  title,
  description,
  onClick,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition cursor-pointer">
      <span className="text-3xl">{icon}</span>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}
