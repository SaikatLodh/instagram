import { PostType } from "../../../src/types";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const getSinglePost = async (): Promise<PostType> => {
  const { data } = await axiosInstance.get(endPoints.reels.getsingelpost);
  return data.data as PostType;
};
