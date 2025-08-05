import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidMessageSquareCheck } from "react-icons/bi";
import Messages from "./Messages";
import { AppDispatch, RootState } from "../../../store/store";
import { useChatusers } from "../../../hooks/react-query/query-hooks/userqueryhook";
import { MessageFolloers } from "../../types";
import { setSelectedUser } from "../../../store/auth/auth";
import { useSendMessage } from "../../../hooks/react-query/query-hooks/messagequeryhooks";
const Chat = () => {
  const [textMessage, setTextMessage] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<MessageFolloers[]>([]);
  const { user, selectedUser } = useSelector((store: RootState) => store.auth);
  const { onlineUsers } = useSelector((store: RootState) => store.onlioneUsers);
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useChatusers();
  const { mutate } = useSendMessage();
  React.useEffect(() => {
    if (data) {
      const getFollowers = data?.map((user) => user?.followers).flat();
      const getFollowing = data?.map((user) => user?.following).flat();
      const margeValue = [...(getFollowers || []), ...(getFollowing || [])];

      const uniqueUsers = margeValue.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
      );
      const filterCurrentUser = uniqueUsers.filter(
        (item) => item._id !== user?._id
      );
      setSelectedUsers(filterCurrentUser);
    }

    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [data, user, dispatch]);

  const sendMessage = () => {
    mutate({
      message: textMessage,
      receiverId: selectedUser?._id as string,
    });
    setTextMessage("");
  };

  return (
    <>
      <div className="flex h-screen">
        <section className="md:w-1/4 sm:w-1/3 my-8">
          <h1 className="font-bold mb-7 px-3 text-xl">{user?.username}</h1>
          <hr className="mb-4 border-gray-300" />
          <div className="overflow-y-auto h-[80vh]">
            {selectedUsers &&
              selectedUsers?.length > 0 &&
              selectedUsers?.map((suggestedUser) => {
                const isOnline = onlineUsers?.includes(suggestedUser?._id);
                return (
                  <>
                    <div
                      className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => dispatch(setSelectedUser(suggestedUser))}
                    >
                      <img
                        src={suggestedUser?.profilePicture?.url}
                        alt=""
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium sm:text-[16px] text-[12px]">
                          {suggestedUser?.username.slice(0, 8) + "..."}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isOnline ? "text-green-600" : "text-red-600"
                          } `}
                        >
                          {isOnline ? "online" : "offline"}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </section>
        {selectedUser ? (
          <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
            <div className="flex gap-3 items-center px-3 border-b border-gray-300 sticky top-0 bg-white z-10  py-5">
              <img
                src={selectedUser?.profilePicture?.url}
                alt={selectedUser?.username}
                className="w-[50px] h-[50px] object-cover rounded-full"
              />
              <div className="flex flex-col">
                <span>{selectedUser?.username}</span>
              </div>
            </div>
            <Messages selectedUser={selectedUser} />
            <div className="flex items-center p-4 border-t border-t-gray-300 gap-4">
              <input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="flex-1 mr-2 focus-visible:ring-transparent py-3 px-2"
                placeholder="Messages..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && textMessage.trim().length > 0) {
                    sendMessage();
                  }
                }}
              />
              {textMessage && textMessage.length > 0 && (
                <button
                  type="submit"
                  className="text-[#2B7FFF]"
                  onClick={sendMessage}
                >
                  Send
                </button>
              )}
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center mx-auto">
            <BiSolidMessageSquareCheck className="sm:w-32 sm:h-32 w-20 h-20 my-4" />
            <h1 className="font-medium">Your messages</h1>
            <span className="sm:text-center text-center">
              Send a message to start a chat.
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
