export type NoteId = string;
export type UserId = string;

export interface Note {
  id: NoteId;
  userId: UserId;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}