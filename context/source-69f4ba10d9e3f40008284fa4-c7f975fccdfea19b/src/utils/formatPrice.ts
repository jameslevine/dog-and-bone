/**
 * Format a price in pence to a GBP string.
 * e.g. 14900 → "£149.00"
 */
export function formatPrice(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100)
}
