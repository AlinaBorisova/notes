import { AppShell, Group, ActionIcon, Stack, Box, Text, NavLink } from "@mantine/core";
import { IconFolderPlus, IconLayoutSidebar, IconFolder, IconTrash } from "@tabler/icons-react";

export const NotesSidebar = () => {
  return (
    <AppShell.Navbar
        p="sm"
        bg="#f6f6f6"
        style={{
          borderRight: '1px solid #e0e0e0',
          borderTopRightRadius: 'var(--mantine-radius-lg)',
          borderBottomRightRadius: 'var(--mantine-radius-lg)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Кнопка создания папки */}
        <Group justify="flex-end" w="100%">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
          >
            <IconFolderPlus size={24} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
          >
            <IconLayoutSidebar size={24} stroke={1.5} />
          </ActionIcon>
        </Group>

        <Stack justify="space-between" h="100%" gap={0}>

          {/* Список папок */}
          <Box>
            <Text size="xs" fw={700} c="dimmed" px="xs" mb={5} mt="md" style={{ letterSpacing: '0.5px' }}>
              ICLOUD
            </Text>
            <Stack gap={2}>
              <NavLink label="Все заметки" active color="yellow" variant="filled" leftSection={<IconFolder size={18} stroke={1.5} />} style={{ borderRadius: 'var(--mantine-radius-md)' }} />
              <NavLink label="Заметки" leftSection={<IconFolder size={18} stroke={1.5} />} style={{ borderRadius: 'var(--mantine-radius-md)' }} />
              <NavLink label="Недавно удаленные" leftSection={<IconTrash size={18} stroke={1.5} />} style={{ borderRadius: 'var(--mantine-radius-md)' }} />
            </Stack>
          </Box>

        </Stack>
      </AppShell.Navbar>
  );
};