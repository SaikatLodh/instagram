import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";
import { Story } from "../../../src/types";

export const getstory = async (): Promise<Story[]> => {
  const response = await axiosInstance.get(endPoints.story.getstories);
  return response.data.data.stories as Story[];
};
