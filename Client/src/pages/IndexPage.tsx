import React, { FormEvent, useEffect, useState } from "react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { sendMessageToServer, sendAudioToServer } from "../hooks/gptHook.ts";
import { Message } from "../types/Message.tsx" 
import Preview from "../components/Preview.tsx";
import MessagesList from "../components/MessagesList.tsx";
import InputArea from "../components/InputArea.tsx";
import RecordingModal from "../components/RecordingModal.tsx";

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

let agreeToSendRecord = false;

const IndexPage: React.FC = () => {
  const [previewState, setPreviewState] = useState("block");
  const [recordingModalState, setRecordingModalState] = useState("hidden");
  const [modalPreloaderState, setModalPreloaderState] = useState("hidden");

  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [displayTime, setDisplayTime] = useState<string>("00:00");

  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState<Message[]>([]);

  const sendMessage = async () => {
    if(!message) return;

    const sendedMessage = {id: Date.now(), text: message, isOwn: true} as Message;
    setPreviewState("hidden");
    setMessagesList((prevMessages) => [...prevMessages, sendedMessage]);

    setMessage("");
    const result: string = await sendMessageToServer(message);

    const receivedMessage = {id: Date.now(), text: result, isOwn: false} as Message;
    setMessagesList((prevMessages) => [...prevMessages, receivedMessage]);
  }

  const inputText = (event: FormEvent<HTMLTextAreaElement>) => {
    const value = (event.target as HTMLTextAreaElement).value;
    setMessage(value);
  }

  const closeModal = () => {
    if(agreeToSendRecord) return;

    setRecordingModalState("hidden");
    mediaRecorder?.stop();
  }

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
        setDisplayTime("00:00");
        setRecordingTime(0);
        clearInterval(recordIntervalId);
        
        if(agreeToSendRecord) {
          setModalPreloaderState("flex");
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
          const result: string = await sendAudioToServer(audioBlob);

          setModalPreloaderState("hidden");
          setRecordingModalState("hidden");

          const receivedMessage = {id: Date.now(), text: result, isOwn: false} as Message;
          setMessage(receivedMessage.text);

          agreeToSendRecord = false;
        }
      }

      mediaRecorder.onstart = async () => {
        audioChunks = [];
        recordIntervalId = setInterval(() => {
          setRecordingTime((current) => current + 1);
        }, 1000);
      }

      mediaRecorder.start();
      setRecordingModalState("flex");
    } catch(e) {
      console.error("Microphone is not active");
    }
  }

  const sendRecordToServer = async () => {
    mediaRecorder?.stop();
    agreeToSendRecord = true;
  }

  useEffect(() => {
    const seconds = recordingTime % 60;
    const minutes = recordingTime / 60;

    const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    const displayMinutes = minutes < 10 ? "0" + Math.trunc(minutes) : minutes;

    setDisplayTime(displayMinutes + ":" + displaySeconds);
  }, [recordingTime]);

  return (
    <div className="container w-full lg:w-2/3 xl:w-1/2 h-[100vh] flex flex-col">
      <Preview previewState={ previewState }></Preview>
      <MessagesList messagesList={ messagesList }></MessagesList>
      <InputArea startRecordingVoice={ startRecordingVoice } sendMessage={ sendMessage } message={ message } inputText={ inputText } ></InputArea>
      <RecordingModal modalPreloaderState={modalPreloaderState} recordingModalState={ recordingModalState } closeModal={ closeModal } displayTime={ displayTime } sendRecordToServer={ sendRecordToServer }></RecordingModal>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <IndexPage/>
  </StrictMode>
);