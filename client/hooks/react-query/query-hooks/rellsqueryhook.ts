import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createPost } from "../../../api/functions/reels/createpost";
import { updatePost } from "../../../api/functions/reels/updatepost";
import axios from "axios";
import toast from "react-hot-toast";
import { reels } from "../query-keys/querykeys";
import { getAllPost } from "../../../api/functions/reels/gertpost";
import { useGlobalHooks } from "../../globalhooks";
import { getprofile } from "../../../store/auth/auth";
import { deletePost } from "../../../api/functions/reels/deletepost";

export const useCreatePost = () => {
  const { queryClient, navigate, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [reels],
        });
        dispatch(getprofile());
        navigate("/getreels");
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

export const useGetPost = () => {
  return useInfiniteQuery({
    queryKey: [reels],
    queryFn: getAllPost,
    initialPageParam: 0,
    getNextPageParam: () => undefined,
  });
};

export const useUpdateReels = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: updatePost,
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

export const useDeleteReels = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: deletePost,
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
