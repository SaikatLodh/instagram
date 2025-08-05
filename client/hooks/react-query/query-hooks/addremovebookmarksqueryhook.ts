import { useMutation } from "@tanstack/react-query";
import { useGlobalHooks } from "../../globalhooks";
import { post } from "../query-keys/querykeys";
import axios from "axios";
import toast from "react-hot-toast";
import { addremovebookmark } from "../../../api/functions/bookmark/addremovebookmark";
import { getprofile } from "../../../store/auth/auth";

export const useAddRemovebookmark = (id: string) => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: () => addremovebookmark(id),
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
