import { useSelector } from "react-redux";
import { SingelUser } from "../../types";
import { RootState } from "../../../store/store";
import { useFollowUnfollow } from "../../../hooks/react-query/query-hooks/followunfollow";

const SingelProfilegetuserdetailes = ({
  user,
}: {
  user: SingelUser | undefined;
}) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { mutate: mutatefollowunfollow } = useFollowUnfollow(
    user?._id as string
  );
  return (
    <>
      <div className="flex items-center sm:p-4 p-2 gap-3">
        <div className="flex justify-center w-full">
          <div className="w-full">
            <img
              src={user?.profilePicture?.url}
              alt=""
              className="object-cover rounded-full sm:w-[100px] sm:h-[100px] w-[70px] h-[70px]"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {user?.username}
          </h2>

          <div className="flex space-x-4 mt-2">
            <span
              className="text-muted-foreground flex gap-1 text-[#86A6FD] cursor-pointer"
              onClick={() => mutatefollowunfollow()}
            >
              {user?.followers?.includes(currentUser?._id as string)
                ? "Following"
                : "follow"}
            </span>
            <span className="text-muted-foreground flex gap-1">
              <h6 className="w-fit">Followers:</h6>

              {user?.followers?.length}
            </span>
            <span className="text-muted-foreground flex gap-1">
              <h6> Following:</h6>

              {user?.following?.length}
            </span>
          </div>
          <p className="text-muted-foreground mt-2">{user?.bio}</p>
        </div>
      </div>
    </>
  );
};

export default SingelProfilegetuserdetailes;
