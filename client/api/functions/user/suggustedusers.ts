import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { suggestedusers } from "../../../src/types";
export const getSuggestedUsers = async (): Promise<suggestedusers[]> => {
  const { data } = await axiosInstance.get(endPoints.user.suggestedusers);
  return data.data as suggestedusers[];
};
