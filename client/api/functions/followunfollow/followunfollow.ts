import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";

export const followunfollow = async (id: string) => {
  const { data } = await axiosInstance.post(
    `${endPoints.followunfollow.followunfollow}/${id}`
  );
  return data;
};
