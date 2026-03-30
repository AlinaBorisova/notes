import { Box, Text } from "@mantine/core";

export const NotesListPanel = () => {
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
        }}
      >
        <Box
          p="sm"
          style={{
            width: '100%',
            minWidth: 0,
            margin: 0,
            alignSelf: 'stretch',
            boxSizing: 'border-box',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            backgroundColor: '#fff9db',
            textAlign: 'left',
            borderRadius: 'var(--mantine-radius-lg)',
          }}
        >
          <Text fw={600} size="sm">
            Название заметки
          </Text>
          <Text size="xs" c="dimmed" truncate="end">
            Текст заметки
          </Text>
        </Box>
      </Box>
    </Box>
  );
};