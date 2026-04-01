import { NoteEditorPanel } from '@/widgets/note-editor-panel';
import { NotesListPanel } from '@/widgets/notes-list-panel';
import { NotesSidebar } from '@/widgets/notes-sidebar';
import { AppShell } from '@mantine/core';
import { NotesProvider, useNotes } from '@/entities/note/model/notes-context';
import { useState } from 'react';

export const NotesPage = () => {
  return (
    <NotesProvider>
      <NotesPageContent />
    </NotesProvider>
  );
};

export const NotesPageContent = () => {
  const {
    notes,
    selectedNote,
    selectedNoteId,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
  } = useNotes();
  const [editNoteId, setEditNoteId] = useState<string | null>(null);

  const handleCreateNote = () => {
    console.log('[NotesPageContent] Вызываю createNote, текущих заметок:', notes.length);
    const id = createNote();
    setEditNoteId(id);
  };

  return (
    <AppShell
      mode="static"
      navbar={{ width: 260, breakpoint: 'sm' }}
      padding={0}
      styles={{
        root: {
          minHeight: '100dvh',
          width: '100%',
          maxWidth: '100%',
        },
        main: {
          flex: 1,
          minHeight: 0,
        },
      }}
    >
      <NotesSidebar />

      <AppShell.Main
        style={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          textAlign: 'left',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        <NotesListPanel
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={selectNote}
        />

        <NoteEditorPanel
          note={selectedNote}
          onCreateNote={handleCreateNote}
          onUpdateNote={updateNote}
          editNoteId={editNoteId}
        />

      </AppShell.Main>
    </AppShell>
  );
};