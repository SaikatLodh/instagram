import { Link } from "react-router-dom";
import { MessageFolloers } from "../../types";
import { useGetMessage } from "../../../hooks/react-query/query-hooks/messagequeryhooks";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { useRef } from "react";
import ScrollToBottom from "./ScrollToBottom";

const Messages = ({ selectedUser }: { selectedUser: MessageFolloers }) => {
  const { data: messages } = useGetMessage(selectedUser?._id);
  const { user } = useSelector((store: RootState) => store.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="overflow-y-auto flex-1 p-4">
        <div className="flex justify-center">
          <div className="flex flex-col items-center justify-center">
            <img
              src={selectedUser?.profilePicture?.url}
              alt={selectedUser?.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <span>{selectedUser?.username}</span>
            <Link to={`/otheraccount/${selectedUser?._id}`}>
              <button className="h-8 my-2 cursor-pointer border border-gray-400 px-4 rounded-lg">
                View profile
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {messages &&
            messages.length > 0 &&
            messages.map((msg) => {
              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === user?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${
                      msg.senderId === user?._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
        </div>
        <div ref={messagesEndRef}></div>
      </div>
      <ScrollToBottom
        data={messages}
        messagesEndRef={messagesEndRef}
        selectedUser={selectedUser}
      />
    </>
  );
};

export default Messages;
