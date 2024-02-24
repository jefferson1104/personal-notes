import { ChangeEvent, FormEvent, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface INewNoteCardProps {
    onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: INewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    function startEditorHandler() {
        setShouldShowOnboarding(false);
    };

    function contentChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);

        if (event.target.value === '') {
            setShouldShowOnboarding(true);
        }
    };

    function startRecordingHandler() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        if (!isSpeechRecognitionAPIAvailable) {
            alert('Unfortunately, your browser does not support this API for recording!');
            return;
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

        speechRecognition = new SpeechRecognitionAPI();

        speechRecognition.lang = 'en-US';
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '');

            setContent(transcription);
        }

        speechRecognition.onerror = (event) => {
            console.log(event)
        }

        speechRecognition.start();
    };

    function stopRecordingHandler() {
        setIsRecording(false);

        if (speechRecognition !== null) {
            speechRecognition.stop();
        }
    };

    function saveNoteHandler(event: FormEvent) {
        event.preventDefault();

        if (content === '') {
            return;
        }

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
                <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
                    <Dialog.Close className='absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-300'>
                                Add note
                            </span>
                            {shouldShowOnboarding ? (
                                <p className='text-sm leading-6 text-slate-400'>
                                    Start by <button type='button' onClick={startRecordingHandler} className='font-medium text-lime-400 hover:underline'>recording an audio note</button> or, if you prefer, <button type='button' onClick={startEditorHandler} className='font-medium text-lime-400 hover:underline'>just use text</button>.
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

                        {isRecording ? (
                            <button
                                type='button'
                                onClick={stopRecordingHandler}
                                className='w-full py-4 flex items-center justify-center gap-2 outline-none bg-slate-900 text-slate-300 text-center text-sm font-medium hover:text-slate-100'
                            >
                                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                Recording! (click to stop)
                            </button>
                        ) : (
                            <button
                                type='button'
                                onClick={saveNoteHandler}
                                className='w-full outline-none py-4 bg-lime-400 text-lime-950 text-center text-sm font-medium hover:bg-lime-500'
                            >
                                Save note
                            </button>
                        )}
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
