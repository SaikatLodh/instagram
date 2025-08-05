import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";

export const likeunlikepost = async (id: string) => {
  const { data } = await axiosInstance.post(
    `${endPoints.likeunlike.likeunlikepost}/${id}`
  );
  return data;
};
