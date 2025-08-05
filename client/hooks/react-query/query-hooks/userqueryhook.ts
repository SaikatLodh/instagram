import { useMutation, useQuery } from "@tanstack/react-query";
import { editeProfile } from "../../../api/functions/user/editeprofile";
import { getOtherUser } from "../../../api/functions/user/getotheruser";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalHooks } from "../../globalhooks";
import { getprofile } from "../../../store/auth/auth";
import {
  user,
  suggesteduser,
  searchuser,
  chatUser,
} from "../query-keys/querykeys";
import { getSuggestedUsers } from "../../../api/functions/user/suggustedusers";
import { searchUser } from "../../../api/functions/user/searchuser";
import { getChatUser } from "../../../api/functions/user/getuserchat";
export const useEditeProfile = () => {
  const { dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: editeProfile,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
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

export const useSingelUser = (id: string) => {
  return useQuery({
    queryKey: [user, id],
    queryFn: () => getOtherUser(id),
  });
};

export const useSuggestedUser = () => {
  return useQuery({
    queryKey: [suggesteduser],
    queryFn: getSuggestedUsers,
  });
};

export const useSearchUser = (query: string) => {
  return useQuery({
    queryKey: [searchuser, query],
    queryFn: () => searchUser(query),
  });
};

export const useChatusers = () => {
  return useQuery({
    queryKey: [chatUser],
    queryFn: getChatUser,
  });
};
