export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function isExpired(date: Date | undefined | null): boolean {
  if (!date) return true;
  return date.getTime() < Date.now();
}

export function toISOString(date: Date): string {
  return date.toISOString();
}
