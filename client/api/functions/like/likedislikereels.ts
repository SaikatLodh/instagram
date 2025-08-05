import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";

export const likeunlikepostreels = async (id: string) => {
  const { data } = await axiosInstance.post(
    `${endPoints.likeunlike.likeunlikepostreels}/${id}`
  );
  return data;
};
