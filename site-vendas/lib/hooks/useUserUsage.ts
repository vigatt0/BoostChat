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

  useEffect(() => {
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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('Erro ao buscar uso:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CHATBOT_API_URL}/user/${userId}/usage`
      );
      setUsage(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar uso:', err);
    }
  };

  return { usage, loading, error, refetch };
}
