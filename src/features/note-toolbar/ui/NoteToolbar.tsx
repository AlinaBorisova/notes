import { Group, ActionIcon, Paper, TextInput, Tooltip } from '@mantine/core';
import { IconSquarePlus, IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';

export const NoteToolbar = () => {
  return (
    <Group gap="sm" wrap="nowrap" justify="space-between" style={{ width: '100%' }}>
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
    </Group>
  );
};