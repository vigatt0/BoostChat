import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface PlanTier {
  id: string;
  name: string;
  price: number;
  priceId: string; // Stripe Price ID
  messages: number;
  isUnlimited: boolean;
  features: string[];
  popular?: boolean;
}

export const PLAN_TIERS: PlanTier[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 50,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || '',
    messages: 300,
    isUnlimited: false,
    features: [
      '300 mensagens por mês',
      'Respostas humanizadas',
      'Histórico de conversas',
      'Suporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 250,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
    messages: 2500,
    isUnlimited: false,
    popular: true,
    features: [
      '2.500 mensagens por mês',
      'Respostas humanizadas',
      'Histórico de conversas',
      'Chat em tempo real',
      'Memória contextual avançada',
      'Suporte prioritário',
    ],
  },
  {
    id: 'unlimited',
    name: 'Ilimitado',
    price: 400,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED || '',
    messages: -1,
    isUnlimited: true,
    features: [
      'Mensagens ilimitadas',
      'Respostas humanizadas',
      'Histórico de conversas',
      'Chat em tempo real',
      'Memória contextual avançada',
      'API de integração',
      'Suporte 24/7',
      'Análises avançadas',
    ],
  },
];
