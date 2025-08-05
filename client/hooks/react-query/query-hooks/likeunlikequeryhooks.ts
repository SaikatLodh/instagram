import { useMutation } from "@tanstack/react-query";
import { useGlobalHooks } from "../../globalhooks";
import { post, reels } from "../query-keys/querykeys";
import axios from "axios";
import toast from "react-hot-toast";
import { likeunlikepost } from "../../../api/functions/like/likedislike";
import { getprofile } from "../../../store/auth/auth";
import { likeunlikepostreels } from "../../../api/functions/like/likedislikereels";
export const useLikeUnlike = (id: string) => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: () => likeunlikepost(id),
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

export const useLikeUnlikeReels = (id: string) => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: () => likeunlikepostreels(id),
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
