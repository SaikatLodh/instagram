import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";

export const addremovebookmark = async (id: string) => {
  const { data } = await axiosInstance.post(
    `${endPoints.bookmark.addbookmark}/${id}`
  );
  return data;
};
