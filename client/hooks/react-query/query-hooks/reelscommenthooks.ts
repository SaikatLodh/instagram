import { useMutation, useQuery } from "@tanstack/react-query";
import { useGlobalHooks } from "../../globalhooks";
import { rellscomment, reels } from "../query-keys/querykeys";
import { createComment } from "../../../api/functions/reelscomment/createcomment";
import axios from "axios";
import toast from "react-hot-toast";
import { getAllComments } from "../../../api/functions/reelscomment/getallcoments";
import { getprofile } from "../../../store/auth/auth";

export const usePostReelsComment = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [reels],
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
    queryKey: [rellscomment],
    queryFn: () => getAllComments(id),
  });
};
