import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import Preview from "../components/Preview.tsx";
import MessagesList from "../components/MessagesList.tsx";
import InputArea from "../components/InputArea.tsx";
import RecordingModal from "../components/RecordingModal.tsx";
import { Provider } from 'react-redux';
import { store } from '../storage/index.ts';

const IndexPage: React.FC = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  return (
    <div className="container w-full lg:w-2/3 xl:w-1/2 h-[100vh] flex flex-col">
      <Preview></Preview>
      <MessagesList></MessagesList>
      <InputArea setMediaRecorder={setMediaRecorder} mediaRecorder={ mediaRecorder }></InputArea>
      <RecordingModal mediaRecorder={ mediaRecorder }></RecordingModal>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <IndexPage/>
    </Provider>
  </StrictMode>
);