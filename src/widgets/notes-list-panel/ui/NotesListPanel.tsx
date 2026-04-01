import { Box, Text } from "@mantine/core";
import type { Note, NoteId } from '@/entities/note/model/types';

type NotesListPanelProps = {
  notes: Note[];
  selectedNoteId: NoteId | null;
  onSelectNote: (id: NoteId) => void;
};

export const NotesListPanel = ({ notes, selectedNoteId, onSelectNote }: NotesListPanelProps) => {
  return (
    <Box
      p="sm"
      style={{
        flex: '0 0 280px',
        width: 280,
        minWidth: 0,
        maxWidth: 280,
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        borderRight: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minWidth: 0,
          flex: 1,
          gap: 10,
          overflow: 'auto',
        }}
      >
        {notes.map((note) => (
          <Box
            key={note.id}
            p="sm"
            style={{
              width: '100%',
              minWidth: 0,
              margin: 0,
              alignSelf: 'stretch',
              boxSizing: 'border-box',
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer',
              backgroundColor: note.id === selectedNoteId ? '#fff9db' : '#fff',
              textAlign: 'left',
              borderRadius: 'var(--mantine-radius-lg)',
            }}
            onClick={() => onSelectNote(note.id)}
          >
            <Text fw={600} size="sm">
              {note.title || 'Без названия'}
            </Text>
            <Text size="xs" c="dimmed" truncate="end">
              {note.content || 'Текст заметки пока пустой'}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};