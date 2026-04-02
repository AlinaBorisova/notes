import { Box, Title, Text, TextInput, Textarea, Modal, Button } from "@mantine/core";
import { NoteToolbar } from '@/features/note-toolbar';
import type { Note } from '@/entities/note/model/types';
import { formatNoteDate } from '@/shared/lib/formatDate';
import type React from 'react';
import { useEffect, useState, useRef } from "react";

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
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isEditing) return;
  
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!editorRef.current) return;
      if (openedDelete) return;
  
      const target = e.target as Node;
  
      if (toolbarRef.current?.contains(target)) return;
  
      if (editorRef.current.contains(target)) return;
  
      setIsEditing(false);
    };
  
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
  
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isEditing, openedDelete]);

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
        ref={toolbarRef}
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
          onCreateNote={() => {
            setIsEditing(false);
            onCreateNote();
          }}
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
          <div ref={editorRef}>
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
          </div>
        )}
        {note && !isEditing && (
          <div ref={editorRef}>
            <Text size="xs" c="dimmed" ta="center" mb="lg">
              {formatNoteDate(note.updatedAt)}
            </Text>
            <Title order={2} fw={700} mb="sm">
              {note.title}
            </Title>
            <Text size="sm">{note.content || 'Текст заметки пока пустой'}</Text>
          </div>
        )}
      </Box>
    </Box >
  );
};