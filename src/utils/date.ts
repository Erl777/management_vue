import { TODAY } from '@/constants';

export const isToday = (deferred: string) =>
  TODAY.toDateString() ===
  new Date(deferred).toDateString();
