import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const editeProfile = async (data: FormData) => {
  const { data: response } = await axiosInstance.patch(
    endPoints.user.editeprofile,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
