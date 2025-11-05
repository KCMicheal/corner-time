// Top 5 most globally used currencies
export const GLOBAL_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface LocationData {
  country: string;
  currency: Currency;
  timezone: string;
}

// Currency mapping by country code
const COUNTRY_CURRENCY_MAP: Record<string, Currency> = {
  US: { code: "USD", symbol: "$", name: "US Dollar" },
  CA: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  GB: { code: "GBP", symbol: "£", name: "British Pound" },
  DE: { code: "EUR", symbol: "€", name: "Euro" },
  FR: { code: "EUR", symbol: "€", name: "Euro" },
  IT: { code: "EUR", symbol: "€", name: "Euro" },
  ES: { code: "EUR", symbol: "€", name: "Euro" },
  CN: { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  JP: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  KR: { code: "KRW", symbol: "₩", name: "South Korean Won" },
  IN: { code: "INR", symbol: "₹", name: "Indian Rupee" },
  BR: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  AU: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  RU: { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  MX: { code: "MXN", symbol: "$", name: "Mexican Peso" },
  NG: { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  SA: { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
  AE: { code: "AED", symbol: "د.إ", name: "United Arab Emirates Dirham" }
  // Add more countries as needed
};

export const getLocationData = async (): Promise<LocationData> => {
  try {
    // Get user's location using IP geolocation
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    const countryCode: string = (data.country_code || "").toUpperCase();
    const currency = COUNTRY_CURRENCY_MAP[countryCode] || GLOBAL_CURRENCIES[0];

    return {
      country: data.country_name || "Unknown",
      currency,
      timezone: data.timezone || "UTC",
    };
  } catch (error) {
    console.warn("Failed to get location data, using default:", error);
    return {
      country: "Unknown",
      currency: GLOBAL_CURRENCIES[0],
      timezone: "UTC",
    };
  }
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = [
    ...GLOBAL_CURRENCIES,
    ...Object.values(COUNTRY_CURRENCY_MAP),
  ].find((c) => c.code === currencyCode);
  return currency?.symbol || "$";
};
