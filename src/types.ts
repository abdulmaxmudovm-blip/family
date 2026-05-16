/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum FamilyRole {
  BOBO = 'Bobo',
  BUVI = 'Buvi',
  OTA = 'Ota',
  ONA = 'Ona',
  MEN = 'Men',
  AKA = 'Aka',
  UKA = 'Uka',
  OPA = 'Opa',
  SINGIL = 'Singil',
  TURMUSH_ORTOG = 'Turmush o\'rtog\'i',
  BOLA = 'Farzand'
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO format (YYYY-MM-DD)
  role: FamilyRole;
  bio: string;
  generation: number; // 0 for the main person, negative for ancestors, positive for descendants
  parentId?: string;
  partnerId?: string;
  childrenIds?: string[];
  photoUrl?: string;
}
