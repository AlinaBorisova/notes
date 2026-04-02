import type { QueryDocumentSnapshot } from 'firebase/firestore';
import type { Note } from '../model/types';

export type FirestoreNoteFields = {
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

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

export function noteToFirestorePayload(
  note: Pick<Note, 'title' | 'content' | 'createdAt' | 'updatedAt' | 'userId'>,
): FirestoreNoteFields {
  return {
    userId: note.userId,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}