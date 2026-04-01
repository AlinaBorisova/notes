import type { Note } from './types';

const STORAGE_KEY = 'notes_app_data';

export function loadNotesFromStorage(): Note[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Note[];

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    console.error('Failed to save notes to storage');
  }
}