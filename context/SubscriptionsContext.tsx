import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@clerk/clerk-expo";

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  deleteSubscription: (id: string) => void;
  isInitialized: boolean;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

const LEGACY_STORE_KEY = "user_subscriptions";

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const STORE_KEY = userId ? `user_subscriptions_${userId}` : LEGACY_STORE_KEY;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSubscriptions = async () => {
      try {
        let stored = await SecureStore.getItemAsync(STORE_KEY);
        
        // Migration from legacy key
        if (!stored && STORE_KEY !== LEGACY_STORE_KEY) {
          const legacyStored = await SecureStore.getItemAsync(LEGACY_STORE_KEY);
          if (legacyStored) {
            stored = legacyStored;
            await SecureStore.setItemAsync(STORE_KEY, legacyStored);
            await SecureStore.deleteItemAsync(LEGACY_STORE_KEY); // cleanup
          }
        }

        if (stored && isMounted) {
          setSubscriptions((prev) => {
             // Only hydrate if we haven't mutated locally yet
             if (prev === HOME_SUBSCRIPTIONS) {
               return JSON.parse(stored as string);
             }
             return prev;
          });
        }
      } catch (error) {
        console.error("Failed to load subscriptions", error);
      } finally {
        if (isMounted) setIsInitialized(true);
      }
    };
    
    loadSubscriptions();
    
    return () => { isMounted = false; };
  }, [STORE_KEY]);

  const saveSubscriptions = async (newSubs: Subscription[]) => {
    try {
      await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(newSubs));
    } catch (error) {
      console.error("Failed to save subscriptions", error);
    }
  };

  const addSubscription = (sub: Subscription) => {
    if (!isInitialized) return;
    setSubscriptions((prev) => {
      const updated = [sub, ...prev];
      saveSubscriptions(updated);
      return updated;
    });
  };

  const deleteSubscription = (id: string) => {
    if (!isInitialized) return;
    setSubscriptions((prev) => {
      const updated = prev.filter((sub) => sub.id !== id);
      saveSubscriptions(updated);
      return updated;
    });
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription, deleteSubscription, isInitialized }}>
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
