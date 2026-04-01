import { Box, Title, Text } from "@mantine/core";
import { NoteToolbar } from '@/features/note-toolbar';

export const NoteEditorPanel = () => {
  return (
    < Box
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
        <NoteToolbar />
      </Box>

      <Box
        style={{ flex: 1, minHeight: 0, overflow: 'auto' }}
        p={40}
      >
        <Text size="xs" c="dimmed" ta="center" mb="lg">
          29 марта 2026 г., 21:30
        </Text>
        <Title order={2} fw={700}>
          Название заметки
        </Title>
      </Box>
    </Box >
  );
};