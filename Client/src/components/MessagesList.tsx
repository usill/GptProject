import { useSelector } from "react-redux";
import { Message } from "../types/Message";
import { RootState } from "../storage";


interface Props {
}

const MessagesList: React.FC<Props> = ({}) => {
  const messagesList = useSelector((state: RootState) => state.chat.messagesList);

  return (
    <div className="mt-8 overflow-auto mb-4">
      {messagesList.map((item: Message) => {
        return (
          <div
            key={item.id}
            className={
              "text-gray-400 w-fit px-4 mt-1 rounded bg-[#1c4c9a] " +
              (item.isOwn ? "ml-auto" : "")
            }
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;