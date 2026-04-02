import { NoteEditorPanel } from '@/widgets/note-editor-panel';
import { NotesListPanel } from '@/widgets/notes-list-panel';
import { NotesSidebar } from '@/widgets/notes-sidebar';
import { AppShell } from '@mantine/core';
import { NotesProvider, useNotes } from '@/entities/note/model/notes-context';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  const filteredNotes = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return notes;

    return notes.filter(
      (n) => 
        n.title.toLowerCase().includes(query) || 
        n.content.toLowerCase().includes(query)
    );
  }, [notes, debouncedSearch]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;
  
    const isSelectedNoteInFilter = filteredNotes.some(n => n.id === selectedNoteId);
    
    if (!isSelectedNoteInFilter) {
      if (filteredNotes.length > 0) {
        selectNote(filteredNotes[0].id);
      } else {
        selectNote(null);
      }
    }
  }, [debouncedSearch, filteredNotes, selectedNoteId, selectNote]);

  const handleCreateNote = async () => {
    console.log('[NotesPageContent] Вызываю createNote, текущих заметок:', notes.length);
    const id = await createNote();
    if (id) {
      setEditNoteId(id);
    }
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
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onSelectNote={selectNote}
        />

        <NoteEditorPanel
          note={selectedNote}
          onCreateNote={handleCreateNote}
          onUpdateNote={updateNote}
          editNoteId={editNoteId}
          onDeleteNote={deleteNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

      </AppShell.Main>
    </AppShell>
  );
};