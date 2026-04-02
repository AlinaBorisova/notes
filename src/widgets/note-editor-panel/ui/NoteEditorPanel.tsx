import { Box, Text, Modal, Button } from "@mantine/core";
import { NoteToolbar } from '@/features/note-toolbar';
import type { Note } from '@/entities/note/model/types';
import { formatNoteDate } from '@/shared/lib/formatDate';
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';

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
  const editableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isEditing && editableRef.current && note) {
      editableRef.current.innerText = note.content ?? '';
    }
  }, [isEditing, note?.id]);

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
      if (openedDelete) return;

      const target = e.target as Node;

      if (toolbarRef.current?.contains(target)) return;

      if (!editableRef.current) return;
      if (editableRef.current.contains(target)) return;

      if (note) {
        const text = (editableRef.current.innerText ?? '').replace(/\r\n/g, '\n');
        const firstLine = text.split('\n')[0]?.trim() ?? '';

        onUpdateNote(note.id, {
          content: text,
          title: firstLine || 'Новая заметка',
        });
      }

      setIsEditing(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [isEditing, openedDelete, note?.id, onUpdateNote]);

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
          <Box style={{ position: 'relative', padding: 0 }}>
            {/* плейсхолдер */}
            {(!note.content || !note.content.trim()) && (
              <Text
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  color: '#adb5bd',
                  pointerEvents: 'none',
                  padding: 0,
                }}
              >
                Введите заметку...
              </Text>
            )}

            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const text = (e.currentTarget.innerText ?? '').replace(/\r\n/g, '\n');

                const firstLine = text.split('\n')[0]?.trim() ?? '';
                onUpdateNote(note.id, {
                  content: text,
                  title: firstLine || 'Новая заметка',
                });
              }}
              style={{
                minHeight: 200,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                outline: 'none',
                fontSize: 18,
                lineHeight: 1.6,
                padding: 0,
              }}
            />
          </Box>
        )}
        {note && !isEditing && (
          <div ref={editorRef}>
            <Text size="xs" c="dimmed" ta="center" mb="lg">
              {formatNoteDate(note.updatedAt)}
            </Text>
            {note.content?.trim() ? (
              <Box style={{ fontSize: 14, lineHeight: 1.6 }}>
                <ReactMarkdown skipHtml>{note.content}</ReactMarkdown>
              </Box>
            ) : (
              <Text size="sm">Текст заметки пока пустой</Text>
            )}
          </div>
        )}
      </Box>
    </Box >
  );
};