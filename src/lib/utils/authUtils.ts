import { PASSWORD_STRENGTH_LEVELS } from "@/lib/constants";

export function getPasswordStrength(value: string) {
  if (!value) return null;
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return (
    PASSWORD_STRENGTH_LEVELS[Math.min(score - 1, 4)] ??
    PASSWORD_STRENGTH_LEVELS[0]
  );
}
