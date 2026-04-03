import type { Firestore } from 'firebase/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { noteFromFirestore, noteToFirestorePayload } from '../lib/note-firestore-mapper';
import type { Note, NoteId } from '../model/types';

export function userNotesCollectionRef(firestore: Firestore, userId: string) {
  return collection(firestore, 'users', userId, 'notes');
}

export function userNoteDocRef(firestore: Firestore, userId: string, noteId: NoteId) {
  return doc(firestore, 'users', userId, 'notes', noteId);
}

export function subscribeUserNotes(
  firestore: Firestore,
  userId: string,
  onNotes: (notes: Note[]) => void,
  onError: (error: unknown) => void,
): () => void {
  const notesQuery = query(
    userNotesCollectionRef(firestore, userId),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    notesQuery,
    (snapshot) => {
      onNotes(snapshot.docs.map((d) => noteFromFirestore(d, userId)));
    },
    onError,
  );
}

export async function createUserNote(
  firestore: Firestore,
  userId: string,
  params?: { title?: string; content?: string },
): Promise<string> {
  const now = new Date().toISOString();
  const title = params?.title ?? 'Новая заметка';
  const content = params?.content ?? '';

  const payload = noteToFirestorePayload({
    userId,
    title,
    content,
    createdAt: now,
    updatedAt: now,
  });

  const docRef = await addDoc(userNotesCollectionRef(firestore, userId), payload);
  return docRef.id;
}

export async function updateUserNote(
  firestore: Firestore,
  userId: string,
  noteId: NoteId,
  patch: { title?: string; content?: string },
): Promise<void> {
  const updates: Record<string, string> = {
    updatedAt: new Date().toISOString(),
  };
  if (patch.title !== undefined) updates.title = patch.title;
  if (patch.content !== undefined) updates.content = patch.content;
  if (Object.keys(updates).length <= 1) {
    return;
  }

  await updateDoc(userNoteDocRef(firestore, userId, noteId), updates);
}

export async function deleteUserNote(
  firestore: Firestore,
  userId: string,
  noteId: NoteId,
): Promise<void> {
  await deleteDoc(userNoteDocRef(firestore, userId, noteId));
}