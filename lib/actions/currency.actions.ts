"use server";

import { formatError } from "../utils";

interface LiveRatesResult {
  success: boolean;
  message?: string;
  rates?: Record<string, number>;
}

// Free, keyless exchange rate feed (updated daily), used to keep
// admin-configured convertRate values from going stale.
export async function getLiveCurrencyRates(
  baseCurrency: string,
  targetCurrencies: string[]
): Promise<LiveRatesResult> {
  try {
    const res = await fetch(
      `https://open.er-api.com/v6/latest/${encodeURIComponent(baseCurrency)}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Exchange rate request failed with status ${res.status}`);
    }
    const data = await res.json();
    if (data.result !== "success" || !data.rates) {
      throw new Error("Exchange rate provider returned an error");
    }

    const rates: Record<string, number> = {};
    for (const code of targetCurrencies) {
      const rate = data.rates[code];
      if (typeof rate === "number") rates[code] = rate;
    }

    return { success: true, rates };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
