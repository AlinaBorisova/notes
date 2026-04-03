import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { db } from '@/shared/api/firebase';
import { useAuth } from '@/entities/user/model/auth-context';
import {
  createUserNote,
  deleteUserNote,
  subscribeUserNotes,
  updateUserNote,
} from '@/entities/note/api/notes-firestore';
import { initialNotesState, notesReducer } from './notes-reducer';
import type { Note, NoteId } from './types';

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

export function NotesProvider({ children }: NotesProviderProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [listLoading, setListLoading] = useState(true);
  const [state, dispatch] = useReducer(notesReducer, initialNotesState);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      dispatch({ type: 'sync', payload: [] });
      setListLoading(false);
      return;
    }

    setListLoading(true);

    const unsubscribe = subscribeUserNotes(
      db,
      user.uid,
      (notes: Note[]) => {
        dispatch({ type: 'sync', payload: notes });
        setListLoading(false);
      },
      (error) => {
        console.error('notes snapshot:', error);
        setListLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const isLoading = authLoading || listLoading;

  const createNote = useCallback(
    async (params?: { title?: string; content?: string }) => {
      if (!user) {
        console.warn('createNote: пользователь не авторизован');
        return undefined;
      }

      try {
        const id = await createUserNote(db, user.uid, params);
        dispatch({ type: 'select', payload: { id } });
        return id;
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
        console.warn('updateNote: пользователь не авторизован');
        return;
      }

      try {
        await updateUserNote(db, user.uid, id, patch);
        dispatch({ type: 'update', payload: { id, ...patch } });
      } catch (e) {
        console.error('updateNote: ошибка Firestore', e);
      }
    },
    [user],
  );

  const deleteNote = useCallback(
    async (id: NoteId) => {
      if (!user) {
        console.warn('deleteNote: пользователь не авторизован');
        return;
      }

      try {
        await deleteUserNote(db, user.uid, id);
        dispatch({ type: 'delete', payload: { id } });
      } catch (e) {
        console.error('deleteNote: ошибка Firestore', e);
      }
    },
    [user],
  );

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
    [
      state.notes,
      state.selectedNoteId,
      selectedNote,
      createNote,
      updateNote,
      deleteNote,
      selectNote,
      isLoading,
    ],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}