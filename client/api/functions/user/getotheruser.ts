import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { SingelUser } from "../../../src/types";
export const getOtherUser = async (id: string): Promise<SingelUser> => {
  const { data } = await axiosInstance.get(
    `${endPoints.user.getotheruser}/${id}`
  );
  return data.data as SingelUser;
};
