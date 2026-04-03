import type { Note, NoteId } from './types';

export type NotesState = {
  notes: Note[];
  selectedNoteId: NoteId | null;
};

export type NotesAction =
  | { type: 'sync'; payload: Note[] }
  | { type: 'update'; payload: { id: NoteId; content?: string; title?: string } }
  | { type: 'delete'; payload: { id: NoteId } }
  | { type: 'select'; payload: { id: NoteId | null } };

export const initialNotesState: NotesState = {
  notes: [],
  selectedNoteId: null,
};

export function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'sync': {
      const notes = action.payload;
      const prev = state.selectedNoteId;
      const selectedNoteId =
        prev && notes.some((n) => n.id === prev) ? prev : notes[0]?.id ?? null;
      return { notes, selectedNoteId };
    }

    case 'update': {
      const { id, title, content } = action.payload;
      const notes = state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              title: title ?? note.title,
              content: content ?? note.content,
              updatedAt: new Date().toISOString(),
            }
          : note,
      );
      return { ...state, notes };
    }

    case 'delete': {
      const { id } = action.payload;
      const notes = state.notes.filter((note) => note.id !== id);

      let selectedNoteId = state.selectedNoteId;
      if (selectedNoteId === id) {
        selectedNoteId = notes[0]?.id ?? null;
      }

      return { notes, selectedNoteId };
    }

    case 'select': {
      return { ...state, selectedNoteId: action.payload.id };
    }

    default:
      return state;
  }
}