// Formats a number as Indian Rupees, e.g. 1234567 -> ₹12,34,567
export const formatINR = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};
