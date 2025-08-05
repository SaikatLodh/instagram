import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const deletestory = async (id: string) => {
  const response = await axiosInstance.delete(
    `${endPoints.story.deletestory}/${id}`
  );
  return response.data;
};
