import { Mic, Send } from "lucide-react";
import { FormEvent } from "react";
import { addMessageToList, setAgreeToSendRecord, setDisplayTime, setModalPreloaderState, setPreviewState, setRecordingModalState, setRecordingTime, setUserMessage } from "../storage/ChatSlice";
import { Display } from "../types/Display";
import { Message } from "../types/Message";
import { sendAudioToServer, sendMessageToServer } from "../hooks/gptHook";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../storage";

let audioChunks: Blob[] = [];

interface Props {
  mediaRecorder: MediaRecorder | null;
  setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>;
}

const InputArea: React.FC<Props> = ({ mediaRecorder, setMediaRecorder }) => {
  const dispatch = useDispatch<AppDispatch>();
  const message = useSelector((state: RootState) => state.chat.userMessage);

  const startRecordingVoice = async () => {
    try {
      let recordIntervalId = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        dispatch(setDisplayTime("00:00"));
        dispatch(setRecordingTime(0));
        clearInterval(recordIntervalId);
        
        const agreeToSendRecord = store.getState().chat.agreeToSendRecord;

        if(agreeToSendRecord) {
          dispatch(setModalPreloaderState(Display.Flex));
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
          const result: string = await sendAudioToServer(audioBlob);

          dispatch(setModalPreloaderState(Display.Hidden));
          dispatch(setRecordingModalState(Display.Hidden));

          const receivedMessage = {id: Date.now(), text: result, isOwn: false} as Message;
          dispatch(setUserMessage(receivedMessage.text));

          dispatch(setAgreeToSendRecord(false));
        }
      }

      mediaRecorder.onstart = async () => {
        audioChunks = [];
        
        recordIntervalId = setInterval(() => {
          const currentTime = store.getState().chat.recordingTime;
          dispatch(setRecordingTime(currentTime + 1));
        }, 1000);
      }

      mediaRecorder.start();
      dispatch(setRecordingModalState(Display.Flex));
      setMediaRecorder(mediaRecorder);

    } catch(e) {
      console.error("Microphone is not active");
    }
  }

  const sendMessage = async () => {
    if(!message) return;

    const sendedMessage = {id: Date.now(), text: message, isOwn: true} as Message;

    dispatch(setPreviewState(Display.Hidden));
    dispatch(addMessageToList(sendedMessage));
    dispatch(setUserMessage(""));
    
    const result: string = await sendMessageToServer(message);
    const receivedMessage = {id: Date.now(), text: result, isOwn: false} as Message;

    dispatch(addMessageToList(receivedMessage));
  }

  const inputText = (event: FormEvent<HTMLTextAreaElement>) => {
    const value = (event.target as HTMLTextAreaElement).value;
    dispatch(setUserMessage(value));
  }

  return (
    <div className="mt-auto mb-4 relative border-2 border-indigo-600 flex rounded-xl">
      <button className="cursor-pointer h-full px-4" onClick={startRecordingVoice}>
        <Mic className="stroke-indigo-600"></Mic>
      </button>
      <div className=" w-full">
        <textarea
          className="text-slate-700 bg-transparent outline-none w-full resize-none pt-6"
          placeholder="Ask whatever you want"
          value={message}
          onInput={inputText}
        />
      </div>
      <button
        onClick={sendMessage}
        className="cursor-pointer px-4 bg-indigo-600 rounded-lg w-20 flex items-center justify-center"
      >
        <Send color="white" size={24}></Send>
      </button>
    </div>
  );
};

export default InputArea;