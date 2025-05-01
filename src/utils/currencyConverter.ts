
/**
 * Utility for currency conversion
 */

// Fixed exchange rate for INR (Indian Rupee)
// In a production app, these would come from a forex API
const exchangeRates: Record<string, number> = {
  'USD': 83.11, // 1 USD = 83.11 INR
  'EUR': 89.26, // 1 EUR = 89.26 INR
  'GBP': 104.98, // 1 GBP = 104.98 INR
  'CAD': 60.66, // 1 CAD = 60.66 INR
  'AUD': 54.71, // 1 AUD = 54.71 INR
  'HKD': 10.64, // 1 HKD = 10.64 INR
  'TWD': 2.58,  // 1 TWD = 2.58 INR
  'INR': 1.00,  // 1 INR = 1 INR (base case)
};

/**
 * Converts an amount from one currency to another
 * @param amount The amount to convert
 * @param fromCurrency The source currency code
 * @param toCurrency The target currency code
 * @returns The converted amount
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string = 'USD',
  toCurrency: string = 'INR'
): number => {
  // If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) return amount;

  // Get exchange rates (defaulting to 1 if not found)
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;

  // For currencies other than INR, we first convert to INR, then to the target currency
  if (toCurrency === 'INR') {
    return amount * fromRate;
  } else if (fromCurrency === 'INR') {
    return amount / toRate;
  } else {
    // Convert from source to INR, then to target
    const amountInInr = amount * fromRate;
    return amountInInr / toRate;
  }
};

/**
 * Formats a currency value with the appropriate symbol
 * @param amount The amount to format
 * @param currency The currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'CA$',
    'AUD': 'A$',
    'HKD': 'HK$',
    'TWD': 'NT$',
    'INR': '₹',
  };

  const symbol = currencySymbols[currency] || currency;
  
  // For INR, use Indian number formatting (with commas)
  if (currency === 'INR') {
    // Format to 2 decimal places
    const formatted = amount.toFixed(2);
    const [whole, decimal] = formatted.split('.');
    
    // Indian number formatting (e.g., 1,00,000 instead of 100,000)
    const lastThree = whole.length > 3 ? whole.slice(-3) : whole;
    const otherNumbers = whole.length > 3 ? whole.slice(0, whole.length - 3) : '';
    const formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + 
                         (otherNumbers ? ',' : '') + lastThree;
                         
    return `${symbol}${formattedWhole}.${decimal}`;
  }
  
  // For other currencies, use standard formatting
  return `${symbol}${amount.toFixed(2)}`;
};
