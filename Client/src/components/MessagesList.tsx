import { Message } from "../types/Message";


interface Props {
  messagesList: Message[]
}

const MessagesList: React.FC<Props> = ({ messagesList }) => {
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