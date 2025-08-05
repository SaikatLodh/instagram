import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";

export const deletePost = async (id: string) => {
  const { data } = await axiosInstance.delete(
    `${endPoints.post.deletepost}/${id}`
  );
  return data;
};
