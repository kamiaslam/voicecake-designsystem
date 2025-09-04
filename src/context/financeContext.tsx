import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import api from "@/services/api";
import { useAuth } from "./authContext";

export type BotType = "conversa" | "empath";

export interface SubscriptionPlan {
  id: number;
  name: string;
  bot_type: BotType;
  minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  expires_at: string;
  minutes_left: number;
  auto_renew: boolean;
  is_active: boolean;
  created_at: string;
  plan: SubscriptionPlan;
}

export interface UsageMeter {
  id: number;
  user_id: number;
  bot_type: BotType;
  stt_minutes?: number;
  tts_minutes?: number;
  llm_minutes?: number;
  empath_minutes?: number;
  updated_at: string;
}

export interface ApiKeyInfo {
  id?: number;
  user_id?: number;
  is_active?: boolean;
  created_at?: string;
  expires_at?: string | null;
  // When creating/rotating, backend may return raw api_key string separately
  api_key_raw?: string | null;
  scope?: string;
  preview?: string;
}

export interface WalletInfo {
  balance_cents: number;
  currency: string;
  premium_voice_surcharge_cents: number;
  updated_at: string;
}

type FinanceContextType = {
  // subscription state
  hasActiveSubscription: boolean;
  activeSubscriptions: Partial<Record<BotType, UserSubscription>>;
  refreshSubscriptions: () => Promise<void>;
  refreshSubscriptionsImmediate: () => Promise<void>;
  subscriptionsLoaded: boolean;
  
  // plan requirement check
  requiresPlan: boolean;
  hasValidPlan: (botType?: BotType) => boolean;
  getRequiredPlanRedirect: () => string;

  // plans
  listPlans: (botType: BotType) => Promise<SubscriptionPlan[]>;

  // purchase
  purchasePlan: (planId: number, opts: { counterparty?: string; autoRenew?: boolean }) => Promise<{ subscription: UserSubscription; apiKeyRaw?: string | null; client_secret?: string; payment_intent_id?: string }>;
  confirmStripePayment: (planId: number, paymentIntentId: string) => Promise<{ subscription: UserSubscription; apiKeyRaw?: string | null }>;

  // usage
  getUsage: (botType: BotType) => Promise<UsageMeter>;
  meterUsage: (botType: BotType, usage: { stt?: number; tts?: number; llm?: number; empath?: number }) => Promise<UsageMeter>;

  // api keys
  getApiKey: () => Promise<ApiKeyInfo>;
  listApiKeys: (scope?: string) => Promise<ApiKeyInfo[]>;
  rotateApiKey: (scope: string) => Promise<ApiKeyInfo>;
  revokeApiKey: (key_id: number) => Promise<void>;

  // add-ons
  purchaseVoiceClone: () => Promise<void>;
  purchasePremiumVoice: () => Promise<void>;
  voiceClonePurchased: boolean;

  // wallet
  getWallet: () => Promise<WalletInfo>;
  topupWallet: (amount_cents: number) => Promise<WalletInfo>;
  setPremiumSurcharge: (cents_per_minute: number) => Promise<WalletInfo>;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<Partial<Record<BotType, UserSubscription>>>({});
  const [subscriptionsLoaded, setSubscriptionsLoaded] = useState<boolean>(false);
  const [voiceClonePurchased, setVoiceClonePurchased] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();
  const hasInitialized = useRef(false);

  const hasActiveSubscription = useMemo(() => {
    return Boolean(activeSubscriptions.conversa || activeSubscriptions.empath);
  }, [activeSubscriptions]);

  // Check if user requires a plan (has no active subscriptions)
  const requiresPlan = useMemo(() => {
    return isAuthenticated && subscriptionsLoaded && !hasActiveSubscription;
  }, [isAuthenticated, subscriptionsLoaded, hasActiveSubscription]);

  // Check if user has a valid plan for a specific bot type or any bot
  const hasValidPlan = useCallback((botType?: BotType): boolean => {
    if (!subscriptionsLoaded) return false;
    
    if (botType) {
      const subscription = activeSubscriptions[botType];
      return Boolean(subscription?.is_active && subscription?.minutes_left > 0);
    }
    
    return hasActiveSubscription;
  }, [subscriptionsLoaded, activeSubscriptions, hasActiveSubscription]);

  // Get the redirect URL for plan purchase
  const getRequiredPlanRedirect = useCallback((): string => {
    return '/purchase-plan';
  }, []);

  const listPlans = useCallback(async (botType: BotType): Promise<SubscriptionPlan[]> => {
    try {
      setError(null);
      const { data } = await api.get(`/finance/plans/${botType}`);
      // Ensure we return an array, even if the API returns unexpected data
      if (Array.isArray(data)) {
        return data as SubscriptionPlan[];
      } else if (data && Array.isArray(data.data)) {
        return data.data as SubscriptionPlan[];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setError('Failed to fetch plans');
      return [];
    }
  }, []);

  const refreshSubscriptions = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes
    
    try {
      setError(null);
      setIsRefreshing(true);
      
      // Check both subscription types using existing endpoints
      const [conversaRes, empathRes] = await Promise.allSettled([
        api.get(`/finance/subscription/conversa`),
        api.get(`/finance/subscription/empath`),
      ]);

      const next: Partial<Record<BotType, UserSubscription>> = {};
      
      // Handle Conversa subscription (single object response)
      if (conversaRes.status === "fulfilled") {
        const conversaData = conversaRes.value.data;
        
        // Check if the response indicates success and has valid subscription data
        if (conversaData && conversaData.success !== false) {
          // The actual subscription data might be nested in a 'data' property
          const subscriptionData = conversaData.data || conversaData;
          
          if (subscriptionData && subscriptionData.is_active && subscriptionData.minutes_left > 0) {
            next.conversa = subscriptionData as UserSubscription;
          }
        }
      }
      
      // Handle Empath subscription (single object response)
      if (empathRes.status === "fulfilled") {
        const empathData = empathRes.value.data;
        
        // Check if the response indicates success and has valid subscription data
        if (empathData && empathData.success !== false) {
          // The actual subscription data might be nested in a 'data' property
          const subscriptionData = empathData.data || empathData;
          
          if (subscriptionData && subscriptionData.is_active && subscriptionData.minutes_left > 0) {
            next.empath = subscriptionData as UserSubscription;
          }
        }
      }

      setActiveSubscriptions(next);
    } catch (e) {
      console.error('Failed to refresh subscriptions:', e);
      setError('Failed to refresh subscriptions');
      // Silent error handling for production
    } finally {
      setSubscriptionsLoaded(true);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Manual refresh function for immediate use after login
  const refreshSubscriptionsImmediate = useCallback(async () => {
    setSubscriptionsLoaded(false);
    await refreshSubscriptions();
  }, [refreshSubscriptions]);

  const purchasePlan = useCallback(
    async (
      planId: number,
      opts: { counterparty?: string; autoRenew?: boolean } = {}
    ): Promise<{ subscription: UserSubscription; apiKeyRaw?: string | null; client_secret?: string; payment_intent_id?: string }> => {
      try {
        setError(null);
        // Create payment intent first
        const intentRes = await api.post(`/finance/purchase/${planId}/create-intent`);
        
        // Check if the response has the expected structure
        if (!intentRes.data) {
          throw new Error("Failed to create payment intent - no response data");
        }
        
        // Handle both direct response and wrapped response formats
        const responseData = intentRes.data;
        let client_secret: string | undefined;
        let payment_intent_id: string | undefined;
        
        if (responseData.success === true && responseData.data) {
          // Standardized response format
          client_secret = responseData.data.client_secret;
          payment_intent_id = responseData.data.payment_intent_id;
        } else if (responseData.client_secret) {
          // Direct response format
          client_secret = responseData.client_secret;
          payment_intent_id = responseData.payment_intent_id;
        } else {
          throw new Error("Failed to create payment intent - invalid response format");
        }
        
        if (!client_secret) {
          throw new Error("Failed to create payment intent - missing client secret");
        }
        
        // Return the client secret for frontend Stripe confirmation
        // The actual subscription creation happens after Stripe confirms payment
        return { 
          subscription: {} as UserSubscription, 
          apiKeyRaw: null,
          client_secret,
          payment_intent_id
        };
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        setError('Failed to create payment intent');
        throw error;
      }
    },
    []
  );

  const confirmStripePayment = useCallback(
    async (planId: number, paymentIntentId: string): Promise<{ subscription: UserSubscription; apiKeyRaw?: string | null }> => {
      try {
        setError(null);
        const response = await api.post(`/finance/purchase/${planId}/confirm`, null, {
          params: { payment_intent_id: paymentIntentId }
        });
        
        // Check if the response has the expected structure
        if (!response.data) {
          throw new Error("Payment confirmation failed - no response data");
        }
        
        const responseData = response.data;
        
        // The API returns a standardized response with success, message, data, and request_id
        if (responseData.success !== true || !responseData.data) {
          throw new Error(responseData.message || "Payment confirmation failed");
        }
        
        const { subscription, api_key } = responseData.data;
        
        if (!subscription) {
          throw new Error("Payment confirmation failed - no subscription data");
        }
        
        // Refresh subscriptions after successful purchase
        await refreshSubscriptions();
        
        return { subscription, apiKeyRaw: api_key ?? null };
      } catch (error) {
        console.error('Payment confirmation failed:', error);
        setError('Payment confirmation failed');
        throw error;
      }
    },
    [refreshSubscriptions]
  );

  const getUsage = useCallback(async (botType: BotType): Promise<UsageMeter> => {
    try {
      setError(null);
      const { data } = await api.get(`/finance/usage/${botType}`);
      return data as UsageMeter;
    } catch (error) {
      console.error(`Failed to fetch usage for ${botType}:`, error);
      setError(`Failed to fetch usage for ${botType}`);
      throw error;
    }
  }, []);

  const meterUsage = useCallback(async (botType: BotType, usage: { stt?: number; tts?: number; llm?: number; empath?: number }): Promise<UsageMeter> => {
    try {
      setError(null);
      const { data } = await api.post(`/finance/usage/${botType}`, usage);
      return (data?.data as UsageMeter) ?? data;
    } catch (error) {
      console.error(`Failed to meter usage for ${botType}:`, error);
      setError(`Failed to meter usage for ${botType}`);
      throw error;
    }
  }, []);

  const getApiKey = useCallback(async (): Promise<ApiKeyInfo> => {
    try {
      setError(null);
      // keep for backward compatibility: get latest key (if any)
      const res = await api.get(`/finance/apikeys`);
      const items = res.data?.data as ApiKeyInfo[] | undefined;
      return (items && items[0]) || {};
    } catch (error) {
      console.error('Failed to fetch API key:', error);
      setError('Failed to fetch API key');
      return {};
    }
  }, []);

  const listApiKeys = useCallback(async (scope?: string): Promise<ApiKeyInfo[]> => {
    try {
      setError(null);
      const { data } = await api.get(`/finance/apikeys`, { params: { scope } });
      return (data?.data as ApiKeyInfo[]) || [];
    } catch (error) {
      console.error('Failed to list API keys:', error);
      setError('Failed to list API keys');
      return [];
    }
  }, []);

  const rotateApiKey = useCallback(async (scope: string): Promise<ApiKeyInfo> => {
    try {
      setError(null);
      const { data } = await api.post(`/finance/apikey/rotate`, null, { params: { scope } });
      const raw = data?.data?.api_key as string | undefined;
      return { api_key_raw: raw ?? null, id: data?.data?.id, scope } as ApiKeyInfo;
    } catch (error) {
      console.error('Failed to rotate API key:', error);
      setError('Failed to rotate API key');
      throw error;
    }
  }, []);

  const revokeApiKey = useCallback(async (key_id: number): Promise<void> => {
    try {
      setError(null);
      await api.post(`/finance/apikey/revoke`, null, { params: { key_id } });
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      setError('Failed to revoke API key');
      throw error;
    }
  }, []);

  const purchaseVoiceClone = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await api.post(`/finance/voice-clone`);
      setVoiceClonePurchased(true);
    } catch (error) {
      console.error('Failed to purchase voice clone:', error);
      setError('Failed to purchase voice clone');
      throw error;
    }
  }, []);

  const purchasePremiumVoice = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await api.post(`/finance/premium-voice`);
    } catch (error) {
      console.error('Failed to purchase premium voice:', error);
      setError('Failed to purchase premium voice');
      throw error;
    }
  }, []);

  const getWallet = useCallback(async (): Promise<WalletInfo> => {
    try {
      setError(null);
      const { data } = await api.get(`/finance/wallet`);
      return data as WalletInfo;
    } catch (error) {
      console.error('Failed to fetch wallet info:', error);
      setError('Failed to fetch wallet info');
      throw error;
    }
  }, []);

  const topupWallet = useCallback(async (amount_cents: number): Promise<WalletInfo> => {
    try {
      setError(null);
      const { data } = await api.post(`/finance/wallet/topup`, { amount_cents });
      return data as WalletInfo;
    } catch (error) {
      console.error('Failed to topup wallet:', error);
      setError('Failed to topup wallet');
      throw error;
    }
  }, []);

  const setPremiumSurcharge = useCallback(async (cents_per_minute: number): Promise<WalletInfo> => {
    try {
      setError(null);
      const { data } = await api.post(`/finance/wallet/premium-toggle`, null, { params: { cents_per_minute } });
      return data as WalletInfo;
    } catch (error) {
      console.error('Failed to set premium surcharge:', error);
      setError('Failed to set premium surcharge');
      throw error;
    }
  }, []);

  useEffect(() => {
    // Refresh when auth token becomes available; if not, mark loaded (public pages)
    if (token && isAuthenticated && !hasInitialized.current) {
      hasInitialized.current = true;
      setSubscriptionsLoaded(false);
      refreshSubscriptions();
    } else if (!token || !isAuthenticated) {
      hasInitialized.current = false;
      setActiveSubscriptions({});
      setSubscriptionsLoaded(true);
    }
  }, [token, isAuthenticated, refreshSubscriptions]);

  const value = useMemo<FinanceContextType>(
    () => ({
      hasActiveSubscription,
      activeSubscriptions,
      refreshSubscriptions,
      refreshSubscriptionsImmediate,
      subscriptionsLoaded,
      requiresPlan,
      hasValidPlan,
      getRequiredPlanRedirect,
      listPlans,
      purchasePlan,
      confirmStripePayment,
      getUsage,
      meterUsage,
      getApiKey,
      listApiKeys,
      rotateApiKey,
      revokeApiKey,
      purchaseVoiceClone,
      purchasePremiumVoice,
      voiceClonePurchased,
      getWallet,
      topupWallet,
      setPremiumSurcharge,
    }),
    [
      hasActiveSubscription,
      activeSubscriptions,
      refreshSubscriptions,
      refreshSubscriptionsImmediate,
      subscriptionsLoaded,
      requiresPlan,
      hasValidPlan,
      getRequiredPlanRedirect,
      listPlans,
      purchasePlan,
      confirmStripePayment,
      getUsage,
      meterUsage,
      getApiKey,
      listApiKeys,
      rotateApiKey,
      revokeApiKey,
      purchaseVoiceClone,
      purchasePremiumVoice,
      voiceClonePurchased,
      getWallet,
      topupWallet,
      setPremiumSurcharge,
    ]
  );

  // Add error boundary to prevent crashes
  if (error) {
    console.error('FinanceContext Error:', error);
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
};