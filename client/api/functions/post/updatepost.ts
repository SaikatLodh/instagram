import { axiosInstance } from "../../axiosinstance/axiosinstance";
import { endPoints } from "../../endpoints/endpoints";

export const updatePost = async ({
  updatedata,
  id,
}: {
  updatedata: FormData;
  id: string | undefined;
}) => {
  const { data } = await axiosInstance.patch(
    `${endPoints.post.updatepost}/${id}`,
    updatedata,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
