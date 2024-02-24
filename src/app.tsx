import { ChangeEvent, useState } from 'react';
import logo from './assets/logo.svg'

import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

import { INote } from './interfaces/note';

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<INote[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes;

  function searchHandler(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  };

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  };

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6'>
      <img src={logo} alt='personal notes logo' width={200} height={200} />

      <form className='w-full'>
        <input
          type="text"
          placeholder='Search your notes...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none'
          onChange={searchHandler}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
