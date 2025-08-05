import { useMutation } from "@tanstack/react-query";
import { followunfollow } from "../../../api/functions/followunfollow/followunfollow";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalHooks } from "../../globalhooks";
import {
  post,
  user,
  searchuser,
  suggesteduser,
  reels,
} from "../query-keys/querykeys";
import { getprofile } from "../../../store/auth/auth";
export const useFollowUnfollow = (id: string) => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: () => followunfollow(id),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [post] });
        queryClient.invalidateQueries({ queryKey: [user] });
        queryClient.invalidateQueries({ queryKey: [searchuser] });
        queryClient.invalidateQueries({ queryKey: [suggesteduser] });
        queryClient.invalidateQueries({ queryKey: [reels] });
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
