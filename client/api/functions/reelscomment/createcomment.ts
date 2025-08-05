import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const createComment = async ({
  value,
  id,
}: {
  value: { text: string };
  id: string;
}) => {
  const { data } = await axiosInstance.post(
    `${endPoints.reelsComment.addcomment}/${id}`,
    value,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};
