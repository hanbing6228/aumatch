// US phone auto-format → XXX-XXX-XXXX as the user types.
export function formatUSPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 10);
  if (digits.length > 6) return `${p1}-${p2}-${p3}`;
  if (digits.length > 3) return `${p1}-${p2}`;
  return p1;
}

export const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const isValidUSPhone = (v: string) => /^\d{3}-\d{3}-\d{4}$/.test(v);
