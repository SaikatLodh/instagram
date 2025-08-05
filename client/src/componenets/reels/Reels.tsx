import { PostType } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useFollowUnfollow } from "../../../hooks/react-query/query-hooks/followunfollow";
import Postpopup from "../post/Postpopup";
import { useState } from "react";
import { useLikeUnlikeReels } from "../../../hooks/react-query/query-hooks/likeunlikequeryhooks";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
const Reels = ({ items }: { items: PostType }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate: mutatefollowunfollow } = useFollowUnfollow(
    items.author._id as string
  );
  const [open, setOpen] = useState(false);
  const { mutate: mutateLike } = useLikeUnlikeReels(items._id);
  const isLiked = items.likes.includes(user?._id || "");
  return (
    <>
      <Postpopup items={items} open={open} setOpen={setOpen} />
      <div className="flex items-center justify-center xl:h-screen md:h-[60vh] overflow-y-auto">
        <div className="relative sm:w-[100%] w-[90%] max-w-md mx-auto 2xl:h-[850px] xl:h-[750px] h-[100vh] bg-black overflow-hidden rounded-xl shadow-lg my-5">
          {/* Video */}
          <video
            className="w-full h-full xl:object-cover md:object-contain object-cover"
            autoPlay
            loop
            muted
            controls
            src={items.contant?.url}
          ></video>

          {/* Actions (Right side) */}
          <div className="absolute right-3 bottom-30 flex flex-col items-center gap-5 text-white">
            <div className="flex flex-col items-center">
              <button
                className={`${
                  isLiked ? "text-red-500" : "text-black"
                } cursor-pointer`}
                onClick={() => mutateLike()}
              >
                {isLiked ? (
                  <FaHeart className="text-3xl" />
                ) : (
                  <FaRegHeart className="text-3xl" />
                )}
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="cursor-pointer" onClick={() => setOpen(true)}>
                <FaRegComment className="text-3xl text-black" />
              </div>
              <span className="text-xs">
                {items.comments.length > 0 && items.comments?.length}
              </span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-10 left-4 text-white text-sm">
            <div className="mb-1 flex gap-2 items-center">
              <img
                src={items.author.profilePicture?.url}
                alt=""
                className="w-[30px] h-[30px] rounded-full"
              />
              <span className="font-bold text-[17px]">
                {items.author.username}
              </span>{" "}
              {items.author._id !== user?._id && (
                <>
                  <h6
                    className="text-[#86a6fd] cursor-pointer"
                    onClick={() => mutatefollowunfollow()}
                  >
                    {items.author.followers.includes(user?._id as string)
                      ? "Following"
                      : "Follow"}
                  </h6>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reels;
