import { MessageFolloers, MessageType } from "../../types";
import { useEffect } from "react";

const ScrollToBottom = ({
  data,
  messagesEndRef,
  selectedUser,
}: {
  data: MessageType[] | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  selectedUser: MessageFolloers;
}) => {
  useEffect(() => {
    if (data && selectedUser && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [data, messagesEndRef, selectedUser]);
  return null;
};

export default ScrollToBottom;
