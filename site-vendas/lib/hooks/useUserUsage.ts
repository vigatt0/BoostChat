'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export interface UserUsage {
  userId: string;
  plan: string;
  messageBalance: number;
  totalMessagesUsed: number;
  isUnlimited: boolean;
  lastMessageAt: Date | null;
}

export function useUserUsage(userId: string | null) {
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CHATBOT_API_URL}/user/${userId}/usage`
      );
      setUsage(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar uso:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [userId]);

  return { usage, loading, error, refetch: fetchUsage };
}
