import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";

const sendMessage = async ({
  message,
  receiverId,
}: {
  message: string;
  receiverId: string;
}) => {
  const { data: res } = await axiosInstance.post(
    `${endPoints.message.sendmessage}/${receiverId}`,
    { message }
  );
  return res;
};

export { sendMessage };
