import { endPoints } from "../../endpoints/endpoints";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { searchUserShape } from "../../../src/types";
export const searchUser = async (
  search: string
): Promise<searchUserShape[]> => {
  const { data } = await axiosInstance.get(
    `${endPoints.user.searchuser}?query=${search}`
  );

  return data.data as searchUserShape[];
};
