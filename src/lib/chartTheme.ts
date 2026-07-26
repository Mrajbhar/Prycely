export const chartColors = {
  ink: '#111111',
  inkSoft: '#444444',
  muted: '#999999',
  line: '#eaeaea',
  brand: '#111111',
  brandLight: '#555555',
  brandTint: '#f4f4f4',
  accent: '#c2410c',
  sale: '#fdead8',
  success: '#0f9d74',
  danger: '#d2453c',
};

export const statusColors: Record<string, string> = {
  Pending: '#999999',
  Confirmed: '#111111',
  Shipped: '#555555',
  Delivered: '#0f9d74',
  Cancelled: '#d2453c',
};

const compact = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 });
export const compactCurrency = (value: number) => `₹${compact.format(value)}`;
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });