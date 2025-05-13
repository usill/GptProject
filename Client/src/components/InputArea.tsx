import { Mic, Send } from "lucide-react";
import { FormEvent } from "react";

interface Props {
  startRecordingVoice: () => {};
  message: string;
  inputText: (event: FormEvent<HTMLTextAreaElement>) => void;
  sendMessage: () => {};
}

const InputArea: React.FC<Props> = ({ startRecordingVoice, message, inputText, sendMessage }) => {
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