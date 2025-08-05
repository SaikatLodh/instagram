import { message } from "../query-keys/querykeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendMessage } from "../../../api/functions/message/sendmessage";
import { useGlobalHooks } from "../../globalhooks";
import { getMessage } from "../../../api/functions/message/getmessage";

export const useSendMessage = () => {
  const { queryClient } = useGlobalHooks();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      if (data.message) {
        queryClient.invalidateQueries({
          queryKey: [message],
        });
      }
    },
  });
};

export const useGetMessage = (receiverId: string) => {
  return useQuery({
    queryKey: [message, receiverId],
    queryFn: () => getMessage(receiverId),
  });
};
