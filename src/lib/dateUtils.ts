/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { differenceInYears, parseISO, isValid } from 'date-fns';

export function calculateAge(birthDate: string): number | null {
  const date = parseISO(birthDate);
  if (!isValid(date)) return null;
  return differenceInYears(new Date(), date);
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Noma\'lum';
  return date.toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
