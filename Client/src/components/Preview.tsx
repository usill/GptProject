import { MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../storage";

interface Props {
}

const Preview: React.FC<Props> = () => {
  const previewState = useSelector((state: RootState) => state.chat.previewState);

  return (
    <div className={"mt-8 " + previewState}>
      <div className="bg-indigo-600 w-fit p-3 rounded-lg">
        <MessageCircle className="fill-white" color="white"></MessageCircle>
      </div>
      <div className="mt-12 flex flex-col gap-4 text-slate-600 text-3xl font-bold w-1/2">
        <div className="font-medium">Hi there!</div>
        <div>What would you like to know</div>
        <div className="text-gray-400 font-normal text-2xl">
          Use one of the most common prompts below or ask your own question
        </div>
      </div>
    </div>
  );
};

export default Preview;