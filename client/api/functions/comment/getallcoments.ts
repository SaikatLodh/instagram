import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";
import { CommentType } from "../../../src/types";

export const getAllComments = async (id: string): Promise<CommentType[]> => {
  const { data } = await axiosInstance.get(
    `${endPoints.comment.getcomment}/${id}`
  );
  return data.data as CommentType[];
};
