/** Formata números angolanos de 9 dígitos como `9xx xxx xxx`. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  const groups = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 9),
  ].filter(Boolean);

  return groups.join(" ");
}
