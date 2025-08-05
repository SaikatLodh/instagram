import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const createstory = async (data: FormData) => {
  const response = await axiosInstance.post(endPoints.story.createstory, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
