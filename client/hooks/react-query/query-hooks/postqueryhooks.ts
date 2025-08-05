import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createPost } from "../../../api/functions/post/createpost";
import { updatePost } from "../../../api/functions/post/updatepost";
import axios from "axios";
import toast from "react-hot-toast";
import { post } from "../query-keys/querykeys";
import { getAllPost } from "../../../api/functions/post/gertpost";
import { useGlobalHooks } from "../../globalhooks";
import { getprofile } from "../../../store/auth/auth";
import { deletePost } from "../../../api/functions/post/deletepost";
export const useCreatePost = () => {
  const { queryClient, navigate, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [post],
        });
        dispatch(getprofile());
        navigate("/");
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
    queryKey: [post],
    queryFn: getAllPost,
    initialPageParam: 0,
    getNextPageParam: () => undefined,
  });
};

export const useUpdatePost = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: updatePost,
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

export const useDeletePost = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: deletePost,
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
