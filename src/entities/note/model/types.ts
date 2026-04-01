export type NoteId = string;

export interface Note {
  id: NoteId;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}