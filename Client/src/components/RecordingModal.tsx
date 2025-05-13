import { X } from "lucide-react";

interface Props {
    recordingModalState: string;
    closeModal: () => void;
    displayTime: string;
    sendRecordToServer: () => void;
    modalPreloaderState: string;
}

const RecordingModal: React.FC<Props> = ({ recordingModalState, closeModal, displayTime, sendRecordToServer, modalPreloaderState }) => {
  return (
    <div
      className={
        "absolute top-0 left-0 w-full h-[100vh] bg-slate-900/70 items-center justify-center " +
        recordingModalState
      }
      onClick={closeModal}
    >
      <div
        className="w-1/3 bg-white relative p-6 flex flex-col gap-4 rounded-xl shadow-xl shadow-slate-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={"absolute left-0 top-0 w-full h-full bg-black/40 rounded-xl z-10 justify-center items-center " + modalPreloaderState}>
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
        <X
          className="absolute right-2 top-2 stroke-gray-600 cursor-pointer"
          onClick={closeModal}
        ></X>
        <div className="text-slate-700 flex items-center gap-4">
          <span>Recording in progress: </span>
          <div className="relative">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <div className="absolute w-2 h-2 bg-red-600/50 rounded-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 impulse"></div>
          </div>
          <span>{displayTime}</span>
        </div>
        <div className="mt-auto">
          <button
            className="px-4 py-2 bg-indigo-600 text-white cursor-pointer rounded-md"
            onClick={sendRecordToServer}
          >
            Send
          </button>
          <button
            className="px-4 py-2 text-slate-700 cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;
