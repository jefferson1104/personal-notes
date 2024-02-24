import logo from './assets/logo.svg'
import { NewNoteCard } from './components/new-note-card';

import { NoteCard } from './components/note-card';

export function App() {
  const note = {
    date: new Date(),
    content: 'Hello world'
  };

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6'>
      <img src={logo} alt='personal notes logo' width={200} height={200} />

      <form className='w-full'>
        <input
          type="text"
          placeholder='Search your notes...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none'
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard />

        <NoteCard note={note} />
      </div>
    </div>
  );
}
