import { Box } from "@mantine/core";
import type { Note, NoteId } from '@/entities/note/model/types';
import { stripMarkdownForPreview } from '@/shared/lib/stripMarkdownPreview';

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
            {(() => {
              const firstLine = (s: string) => (s ?? '').split(/\r?\n/)[0]?.trim() ?? '';

              const titleLine = firstLine(note.title || 'Без названия');

              const contentLines = (note.content || '').split(/\r?\n/);
              const contentLine = contentLines[1]?.trim() ?? contentLines[0]?.trim() ?? '';

              const emptyPlaceholder = 'Текст заметки пока пустой';

              return (
                <>
                  <Box
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: 1.25,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    <span>
                      {stripMarkdownForPreview(titleLine) || 'Без названия'}
                    </span>
                  </Box>

                  <Box
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: '#868e96',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    <span>
                      {contentLine
                        ? stripMarkdownForPreview(contentLine) || emptyPlaceholder
                        : emptyPlaceholder}
                    </span>
                  </Box>
                </>
              );
            })()}
          </Box>
        ))}
      </Box>
    </Box>
  );
};