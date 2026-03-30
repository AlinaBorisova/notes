import { Box, Tooltip, ActionIcon, Group, Paper, TextInput, Title, Text } from "@mantine/core";
import { IconSquarePlus, IconPencil, IconSearch, IconTrash } from "@tabler/icons-react";

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Tooltip label="Новая заметка" position="bottom">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            type="button"
            radius="xl"
            aria-label="Создать новую заметку"
          >
            <IconSquarePlus size={22} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Group gap="sm" wrap="nowrap" justify="flex-end" style={{ flex: 1, minWidth: 0 }}>
          <Paper
            p={2}
            radius="xl"
            withBorder
            style={{
              borderColor: 'var(--mantine-color-gray-3)',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
          >
            <Group gap={0}>
              <Tooltip label="Редактировать" position="bottom">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="md"
                  type="button"
                  aria-label="Редактировать заметку"
                >
                  <IconPencil size={18} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Удалить" position="bottom">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="md"
                  type="button"
                  aria-label="Удалить заметку"
                >
                  <IconTrash size={18} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Paper>

          <TextInput
            placeholder="Поиск"
            size="sm"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            aria-label="Поиск заметок"
            style={{ flex: '1 1 160px', maxWidth: 280, minWidth: 120 }}
          />
        </Group>
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