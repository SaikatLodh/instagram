import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { MassageUser } from "../../../src/types";
export const getChatUser = async (): Promise<MassageUser[]> => {
  const { data } = await axiosInstance.get(
    `${endPoints.user.getchatusers}`
  );
  return data.data as MassageUser[];
};
