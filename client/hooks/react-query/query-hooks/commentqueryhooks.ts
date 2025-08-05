import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../globalhooks";
import { comment, post } from "../query-keys/querykeys";
import { createComment } from "../../../api/functions/comment/createcomment";
import axios from "axios";
import toast from "react-hot-toast";
import { getAllComments } from "../../../api/functions/comment/getallcoments";
import { getprofile } from "../../../store/auth/auth";
export const usePostComment = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [post],
        });
        dispatch(getprofile());
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    },
  });
};

export const useGetComment = (id: string) => {
  return useQuery({
    queryKey: [comment],
    queryFn: () => getAllComments(id),
  });
};
