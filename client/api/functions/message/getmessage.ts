import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { MessageType } from "../../../src/types";

export const getMessage = async (
  receiverId: string
): Promise<MessageType[]> => {
  const { data } = await axiosInstance.get(
    `${endPoints.message.getmessage}/${receiverId}`
  );

  return data.data.message as MessageType[] || [];
};
