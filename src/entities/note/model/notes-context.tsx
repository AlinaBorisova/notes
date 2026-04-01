import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { loadNotesFromStorage, saveNotesToStorage } from './storage';
import type { Note, NoteId } from './types';

type NotesState = {
  notes: Note[];
  selectedNoteId: NoteId | null;
};

type NotesAction =
  | { type: 'init'; payload: Note[] }
  | { type: 'create'; payload: { title?: string; content?: string } }
  | { type: 'update'; payload: { id: NoteId; content?: string; title?: string } }
  | { type: 'delete'; payload: { id: NoteId } }
  | { type: 'select'; payload: { id: NoteId | null } };

type NotesContextValue = {
  notes: Note[];
  selectedNoteId: NoteId | null;
  selectedNote: Note | null;
  createNote: (params?: { title?: string; content?: string }) => void;
  updateNote: (id: NoteId, patch: { title?: string; content?: string }) => void;
  deleteNote: (id: NoteId) => void;
  selectNote: (id: NoteId | null) => void;
};

type NotesProviderProps = {
  children: React.ReactNode;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return ctx;
}

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'init': {
      const notes = action.payload;
      const selectedNoteId = notes[0]?.id ?? null;
      return { notes, selectedNoteId };
    }

    case 'create': {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: action.payload.title ?? 'Новая заметка',
        content: action.payload.content ?? '',
        createdAt: now,
        updatedAt: now,
      };

      console.log('[notesReducer] Создана новая заметка:', newNote);

      return {
        notes: [newNote, ...state.notes],
        selectedNoteId: newNote.id,
      };
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

export function NotesProvider({ children }: NotesProviderProps) {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    selectedNoteId: null,
  });

  useEffect(() => {
    const notes = loadNotesFromStorage();
    dispatch({ type: 'init', payload: notes });
  }, []);

  useEffect(() => {
    saveNotesToStorage(state.notes);
  }, [state.notes]);

  const createNote = useCallback(
    (params?: { title?: string; content?: string }) => {
      console.log('[NotesContext] Диспатч создания заметки, параметры:', params);
      dispatch({ type: 'create', payload: params ?? {} });
    },
    [],
  );

  const updateNote = useCallback(
    (id: NoteId, patch: { title?: string; content?: string }) => {
      dispatch({ type: 'update', payload: { id, ...patch } });
    },
    [],
  );

  const deleteNote = useCallback((id: NoteId) => {
    dispatch({ type: 'delete', payload: { id } });
  }, []);

  const selectNote = useCallback((id: NoteId | null) => {
    dispatch({ type: 'select', payload: { id } });
  }, []);

  const selectedNote = useMemo(
    () => state.notes.find((note) => note.id === state.selectedNoteId) ?? null,
    [state.notes, state.selectedNoteId],
  );

  const value: NotesContextValue = useMemo(
    () => ({
      notes: state.notes,
      selectedNoteId: state.selectedNoteId,
      selectedNote,
      createNote,
      updateNote,
      deleteNote,
      selectNote,
    }),
    [state.notes, state.selectedNoteId, selectedNote, createNote, updateNote, deleteNote, selectNote],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
