export function getUnlockPrice(overall: number): number {
  if (overall < 70) return 0;
  if (overall < 80) return 30;
  if (overall < 85) return 40;
  if (overall < 90) return 50;
  return 100;
}
