import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/shared/api/firebase';
import { useAuth } from '@/entities/user/model/auth-context';
import { loadNotesFromStorage, saveNotesToStorage } from './storage';
import type { Note, NoteId } from './types';

type NotesState = {
  notes: Note[];
  selectedNoteId: NoteId | null;
};

type NotesAction =
  | { type: 'init'; payload: Note[] }
  | { type: 'create'; payload: { id: NoteId; userId: string; title?: string; content?: string } }
  | { type: 'update'; payload: { id: NoteId; content?: string; title?: string } }
  | { type: 'delete'; payload: { id: NoteId } }
  | { type: 'select'; payload: { id: NoteId | null } };

type NotesContextValue = {
  notes: Note[];
  selectedNoteId: NoteId | null;
  selectedNote: Note | null;
  createNote: (params?: { title?: string; content?: string }) => Promise<NoteId | undefined>;
  updateNote: (id: NoteId, patch: { title?: string; content?: string }) => Promise<void>;
  deleteNote: (id: NoteId) => Promise<void>;
  selectNote: (id: NoteId | null) => void;
  isLoading: boolean;
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

export function noteFromFirestore(
  docSnap: QueryDocumentSnapshot,
  userId: string,
): Note {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    userId,
    title: data.title ?? 'Новая заметка',
    content: data.content ?? '',
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  };
}

export function noteToFirestorePayload(note: Pick<Note, 'title' | 'content' | 'createdAt' | 'updatedAt' | 'userId'>) {
  return {
    userId: note.userId,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
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
        id: action.payload.id,
        userId: action.payload.userId,
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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    selectedNoteId: null,
  });
  const [hasLoaded, setHasLoaded] = useState(false);


  useEffect(() => {
    const notes = loadNotesFromStorage();
    console.log('Init: загружено заметок из localStorage:', notes.length);
    dispatch({ type: 'init', payload: notes });
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    console.log('Save: заметок в состоянии:', state.notes.length);
    saveNotesToStorage(state.notes);
  }, [state.notes, hasLoaded]);

  const createNote = useCallback(
    async (params?: { title?: string; content?: string }) => {
      if (!user) {
        console.warn('createNote: пользователь не авторизован');
        return undefined;
      }

      const now = new Date().toISOString();
      const title = params?.title ?? 'Новая заметка';
      const content = params?.content ?? '';

      const payload = noteToFirestorePayload({
        userId: user.uid,
        title,
        content,
        createdAt: now,
        updatedAt: now,
      });

      try {
        const ref = collection(db, 'users', user.uid, 'notes');
        const docRef = await addDoc(ref, payload);
        dispatch({
          type: 'create',
          payload: {
            id: docRef.id,
            userId: user.uid,
            title,
            content,
          },
        });
        return docRef.id;
      } catch (e) {
        console.error('createNote: ошибка Firestore', e);
        return undefined;
      }
    },
    [user],
  );

  const updateNote = useCallback(
    async (id: NoteId, patch: { title?: string; content?: string }) => {
      if (!user) {
        console.log('Пользователь не авторизован');
        return;
      }

      const updates: Record<string, string> = {
        updatedAt: new Date().toISOString(),
      };
      if (patch.title !== undefined) updates.title = patch.title;
      if (patch.content !== undefined) updates.content = patch.content;
      if (Object.keys(updates).length <= 1) {
        return;
      }
      const noteRef = doc(db, 'users', user.uid, 'notes', id);
      try {
        await updateDoc(noteRef, updates);
        dispatch({ type: 'update', payload: { id, ...patch } });
      } catch (e) {
        console.error('updateNote: ошибка Firestore', e);
      }
    },
    [user],
  );

  const deleteNote = useCallback(async (id: NoteId) => {
    if (!user) {
      console.log('Пользователь не авторизован');
      return;
    }
    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    try {
      await deleteDoc(noteRef);
      dispatch({ type: 'delete', payload: { id } });
    } catch (e) {
      console.log('Ошибка Firestore', e);
    }
  }, [user]);

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
      isLoading,
    }),
    [state.notes, state.selectedNoteId, selectedNote, createNote, updateNote, deleteNote, selectNote, isLoading],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
