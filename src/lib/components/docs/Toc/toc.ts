import { writable } from 'svelte/store';

export interface TOCEntry {
  id: string;
  title: string;
  level: number;
  children: TOCEntry[];
}
export const tocItems = writable<TOCEntry[]>([]);
