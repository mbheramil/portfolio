// Single source of truth — data lives in content.json, edited via /admin.
// To update content: go to https://mbheramil.com/admin/
import rawData from './content.json';

export interface Social { label: string; url: string }

export const site = rawData as Omit<typeof rawData, 'socials'> & {
  socials: Social[];
};

export type Site = typeof site;
