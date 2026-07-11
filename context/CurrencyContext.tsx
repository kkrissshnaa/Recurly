import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CurrencyType = "INR" | "USD";

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  formatPrice: (price: number, originalCurrency?: string) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyType>("INR");
  const [exchangeRate, setExchangeRate] = useState<number>(83.5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        // Load saved currency preference
        const savedCurrency = await AsyncStorage.getItem("app_currency");
        if (savedCurrency === "USD" || savedCurrency === "INR") {
          setCurrencyState(savedCurrency);
        }

        // Fetch latest exchange rate
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (response.ok) {
          const data = await response.json();
          if (data && data.rates && data.rates.INR) {
            setExchangeRate(data.rates.INR);
          }
        }
      } catch (error) {
        console.error("Failed to initialize currency context", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  const setCurrency = async (newCurrency: CurrencyType) => {
    setCurrencyState(newCurrency);
    try {
      await AsyncStorage.setItem("app_currency", newCurrency);
    } catch (error) {
      console.error("Failed to save currency preference", error);
    }
  };

  const formatPrice = (price: number, originalCurrency: string = "INR") => {
    let convertedPrice = price;

    if (originalCurrency === "INR" && currency === "USD") {
      convertedPrice = price / exchangeRate;
    } else if (originalCurrency === "USD" && currency === "INR") {
      convertedPrice = price * exchangeRate;
    }

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedPrice);
    } catch {
      return `${currency === "USD" ? "$" : "₹"}${convertedPrice.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
