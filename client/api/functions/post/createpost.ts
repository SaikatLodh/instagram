import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const createPost = async (postdata: FormData) => {
  const { data } = await axiosInstance.post(
    endPoints.post.createpost,
    postdata,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
