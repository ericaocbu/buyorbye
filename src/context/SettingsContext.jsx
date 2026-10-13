import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SettingsContext = createContext(null);
const STORAGE_KEY = "buyorbye-settings";

export const defaultSettings = {
  currency: "USD",
  budget: "150",
  priorities: ["price", "quality"],
  reminder: "balanced",
};

function readSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    const parsed = JSON.parse(stored);

    return {
      ...defaultSettings,
      ...parsed,
      priorities: Array.isArray(parsed.priorities)
        ? parsed.priorities
        : defaultSettings.priorities,
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readSettings);
  const [rates, setRates] = useState({ USD: 1 });
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesAvailable, setRatesAvailable] = useState(true);
  const [rateDate, setRateDate] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRates() {
      try {
        const response = await fetch(
          "https://api.frankfurter.dev/v1/latest?base=USD&symbols=CAD,GBP,EUR",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Exchange rates are currently unavailable.");
        }

        const data = await response.json();

        if (!data.rates) {
          throw new Error("No exchange rates were returned.");
        }

        setRates({ USD: 1, ...data.rates });
        setRateDate(data.date || "");
        setRatesAvailable(true);
      } catch (error) {
        if (error.name !== "AbortError") {
          setRatesAvailable(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRatesLoading(false);
        }
      }
    }

    fetchRates();

    return () => controller.abort();
  }, []);

  const updateSettings = useCallback((updates) => {
    setSettings((current) => ({
      ...current,
      ...updates,
    }));
  }, []);

  const saveSettings = useCallback((nextSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
      setSettings(nextSettings);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultSettings });
  }, []);

  const convertPrice = useCallback(
    (value, fromCurrency = "USD", toCurrency = settings.currency) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        !Number.isFinite(Number(value))
      ) {
        return null;
      }

      const amount = Number(value);

      if (fromCurrency === toCurrency) return amount;

      // Convert through USD when a source currency differs.
      const fromRate = rates[fromCurrency];
      const toRate = rates[toCurrency];

      if (!fromRate || !toRate) return null;

      return (amount / fromRate) * toRate;
    },
    [rates, settings.currency]
  );

  const formatCurrency = useCallback((value, currency = settings.currency) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      !Number.isFinite(Number(value))
    ) {
      return null;
    }

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(Number(value));
    } catch {
      return `${Number(value).toFixed(2)} ${currency}`;
    }
  }, [settings.currency]);

  const formatPrice = useCallback(
    (value, sourceCurrency = "USD") => {
      const converted = convertPrice(value, sourceCurrency, settings.currency);

      if (converted === null) return null;

      return formatCurrency(converted, settings.currency);
    },
    [convertPrice, formatCurrency, settings.currency]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        saveSettings,
        resetSettings,
        convertPrice,
        formatCurrency,
        formatPrice,
        ratesLoading,
        ratesAvailable,
        rateDate,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}