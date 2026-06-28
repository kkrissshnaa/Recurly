import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  deleteSubscription: (id: string) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

const STORE_KEY = "user_subscriptions";

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const stored = await SecureStore.getItemAsync(STORE_KEY);
        if (stored) {
          setSubscriptions(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load subscriptions", error);
      }
    };
    loadSubscriptions();
  }, []);

  const saveSubscriptions = async (newSubs: Subscription[]) => {
    try {
      await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(newSubs));
    } catch (error) {
      console.error("Failed to save subscriptions", error);
    }
  };

  const addSubscription = (sub: Subscription) => {
    setSubscriptions((prev) => {
      const updated = [sub, ...prev];
      saveSubscriptions(updated);
      return updated;
    });
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => {
      const updated = prev.filter((sub) => sub.id !== id);
      saveSubscriptions(updated);
      return updated;
    });
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription, deleteSubscription }}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (context === undefined) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }
  return context;
}
