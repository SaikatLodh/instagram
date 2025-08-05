import { FaRegMessage } from "react-icons/fa6";
import { Link } from "react-router-dom";

const MobilChatButton = () => {
  return (
    <>
      <div className="fixed bottom-32 right-4 z-90 sm:hidden block">
        <Link to="/chat">
          <button className="bg-black text-white font-bold py-4 px-4 rounded-full flex gap-2 items-center">
            <FaRegMessage />
          </button>
        </Link>
      </div>
    </>
  );
};

export default MobilChatButton;
