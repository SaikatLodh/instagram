import { PostType } from "../../../src/types";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const getAllPost = async (): Promise<PostType[]> => {
  const { data } = await axiosInstance.get(endPoints.post.getallpost);
  return data.data as PostType[];
};
