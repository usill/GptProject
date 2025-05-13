import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../types/Message";
import { Display } from "../types/Display";

interface ChatState {
    previewState: Display;
    recordingModalState: Display;
    modalPreloaderState: Display;
    recordingTime: number;
    displayTime: string;
    userMessage: string;
    messagesList: Message[];
    agreeToSendRecord: boolean;
}

const initialState: ChatState = {
    previewState: Display.Block,
    recordingModalState: Display.Hidden,
    modalPreloaderState: Display.Hidden,
    recordingTime: 0,
    displayTime: "00:00",
    userMessage: "",
    messagesList: [],
    agreeToSendRecord: false,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setPreviewState(state, action: PayloadAction<Display>) {
            state.previewState = action.payload;
        },
        setRecordingModalState(state, action: PayloadAction<Display>) {
            state.recordingModalState = action.payload;
        },
        setModalPreloaderState(state, action: PayloadAction<Display>) {
            state.modalPreloaderState = action.payload;
        },
        setRecordingTime(state, action: PayloadAction<number>) {
            state.recordingTime = action.payload;
        },
        setDisplayTime(state, action: PayloadAction<string>) {
            state.displayTime = action.payload;
        },
        setUserMessage(state, action: PayloadAction<string>) {
            state.userMessage = action.payload;
        },
        addMessageToList(state, action: PayloadAction<Message>) {
            state.messagesList = [...state.messagesList, action.payload];
        },
        setAgreeToSendRecord(state, action: PayloadAction<boolean>) {
            state.agreeToSendRecord = action.payload;
        },
    }
});

export const {
    setPreviewState,
    setRecordingModalState,
    setModalPreloaderState,
    setRecordingTime,
    setDisplayTime,
    setUserMessage,
    addMessageToList,
    setAgreeToSendRecord,
} = chatSlice.actions;
export default chatSlice.reducer;