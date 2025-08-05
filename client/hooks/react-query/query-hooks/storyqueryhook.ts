import { useQuery, useMutation } from "@tanstack/react-query";
import { createstory } from "../../../api/functions/story/createstory";
import { story } from "../query-keys/querykeys";
import toast from "react-hot-toast";
import { getstory } from "../../../api/functions/story/getstory";
import { deletestory } from "../../../api/functions/story/deletestory";
import { useGlobalHooks } from "../../globalhooks";
import axios from "axios";

const useCreateStory = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createstory,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [story],
        });
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

const useGetStory = () => {
  return useQuery({
    queryKey: [story],
    queryFn: getstory,
  });
};

const useDeleteStory = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: deletestory,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [story],
        });
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
export { useCreateStory, useGetStory, useDeleteStory };
