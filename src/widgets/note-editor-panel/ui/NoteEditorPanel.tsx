import { Box, Title, Text, TextInput, Textarea, Modal, Button } from "@mantine/core";
import { NoteToolbar } from '@/features/note-toolbar';
import type { Note } from '@/entities/note/model/types';
import { formatNoteDate } from '@/shared/lib/formatDate';
import type React from 'react';
import { useEffect, useState } from "react";

type NoteEditorPanelProps = {
  note: Note | null;
  onCreateNote: () => void;
  onUpdateNote: (id: string, patch: { title?: string; content?: string }) => void;
  editNoteId?: string | null
  onDeleteNote: (id: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export const NoteEditorPanel = ({ note, onCreateNote, onUpdateNote, editNoteId, onDeleteNote, searchQuery, onSearchChange }: NoteEditorPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);

  useEffect(() => {
    if (!note) {
      setIsEditing(false);
      return;
    }

    if (editNoteId && note.id === editNoteId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [note?.id, editNoteId]);

  return (
    <Box
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }
      }
    >
      <Box
        px="md"
        py={6}
        style={{
          flexShrink: 0,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <NoteToolbar
          onCreateNote={onCreateNote}
          onToggleEdit={() => setIsEditing((prev) => !prev)}
          onDeleteNote={() => setOpenedDelete(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <Modal opened={openedDelete} onClose={() => setOpenedDelete(false)} title="Удаление заметки">
          <Text>Вы уверены, что хотите удалить эту заметку?</Text>
          <Button
            onClick={() => {
              if (!note) return;
              onDeleteNote(note.id);
              setOpenedDelete(false);
            }}
          >
            Удалить
          </Button>
        </Modal>

      </Box>

      <Box
        style={{ flex: 1, minHeight: 0, overflow: 'auto' }}
        p={40}
      >
        {!note && (
          <Text c="dimmed">Выберите заметку слева или создайте новую.</Text>
        )}

        {note && isEditing && (
          <>
            <TextInput
              label="Заголовок"
              value={note.title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onUpdateNote(note.id, { title: event.currentTarget.value })
              }
              mb="sm"
            />
            <Textarea
              label="Текст"
              autosize
              minRows={6}
              value={note.content}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                onUpdateNote(note.id, { content: event.currentTarget.value })
              }
            />
          </>
        )}
        {note && !isEditing && (
          <>
            <Text size="xs" c="dimmed" ta="center" mb="lg">
              {formatNoteDate(note.updatedAt)}
            </Text>
            <Title order={2} fw={700} mb="sm">
              {note.title}
            </Title>
            <Text size="sm">{note.content || 'Текст заметки пока пустой'}</Text>
          </>
        )}
      </Box>
    </Box >
  );
};