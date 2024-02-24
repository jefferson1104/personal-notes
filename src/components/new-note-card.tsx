import { ChangeEvent, FormEvent, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface INewNoteCardProps {
    onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: INewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [content, setContent] = useState('');

    function startEditorHandler() {
        setShouldShowOnboarding(false);
    };

    function contentChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);

        if (event.target.value === '') {
            setShouldShowOnboarding(true);
        }
    };

    function saveNoteHandler(event: FormEvent) {
        event.preventDefault();

        onNoteCreated(content);

        setContent('');
        setShouldShowOnboarding(true);

        toast.success('Note created successfully!');
    };

    return (
        <Dialog.Root>
            {/* Card */}
            <Dialog.Trigger className='rounded-md flex flex-col gap-3 p-5 text-left bg-slate-700 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-200'>
                    Add note
                </span>
                <p className='text-sm leading-6 text-slate-400'>
                    Record an audio note that will be converted to text automatically.
                </p>
            </Dialog.Trigger>

            {/* Modal */}
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50' />
                <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none'>
                    <Dialog.Close className='absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form onSubmit={saveNoteHandler} className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-300'>
                                Add note
                            </span>
                            {shouldShowOnboarding ? (
                                <p className='text-sm leading-6 text-slate-400'>
                                    Start by <button className='font-medium text-lime-400 hover:underline'>recording an audio note</button> or, if you prefer, <button onClick={startEditorHandler} className='font-medium text-lime-400 hover:underline'>just use text</button>.
                                </p>
                            ): (
                                <textarea
                                    autoFocus
                                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                    onChange={contentChangeHandler}
                                    value={content}
                                />
                            )}
                        </div>

                        <button
                            type='submit'
                            className='w-full outline-none py-4 bg-lime-400 text-lime-950 text-center text-sm font-medium hover:bg-lime-500'
                        >
                            Save note
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
