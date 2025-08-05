import { AiFillLike } from "react-icons/ai";
import Postpopup from "../post/Postpopup";
import { useState } from "react";
import { FaComment } from "react-icons/fa";
import { PostType } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useLikeUnlike } from "../../../hooks/react-query/query-hooks/likeunlikequeryhooks";

type ExploreProps = {
  item: PostType;
};
const Explore: React.FC<ExploreProps> = ({ item }) => {
  const { mutate: mutateLike } = useLikeUnlike(item._id);
  const { user } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const isLiked = item.likes.includes(user?._id || "");
  return (
    <>
      <Postpopup items={item} open={open} setOpen={setOpen} />
      <div className="sn:w-[24%] w-[47%] sm:h-[400px] h-[120px] relative cursor-pointer">
        <img
          src={item?.contant?.url}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute left-0 top-0 bg-[#0000007a] w-full h-full opacity-0 hover:opacity-[1] transition-all duration-300">
          <div className="flex items-center justify-center gap-3 w-full h-full">
            <div className="flex justify-center text-white gap-2 text-[22px]">
              <div className="w-fit">
                <FaComment onClick={() => setOpen(true)} />
                {item?.comments &&
                  item?.comments.length > 0 &&
                  item?.comments.length}
              </div>

              <div className="w-fit" onClick={() => mutateLike()}>
                {isLiked ? (
                  <AiFillLike className="text-red-500" />
                ) : (
                  <AiFillLike className="text-white" />
                )}
                {item?.likes.length > 0 && item.likes.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
