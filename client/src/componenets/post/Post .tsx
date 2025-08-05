import { CiBookmark } from "react-icons/ci";
import { PostType, User } from "../../types";
import Comment from "../comment/Comment";
import { useLikeUnlike } from "../../../hooks/react-query/query-hooks/likeunlikequeryhooks";
import { useAddRemovebookmark } from "../../../hooks/react-query/query-hooks/addremovebookmarksqueryhook";
import { FaBookmark } from "react-icons/fa";
import Postpopup from "./Postpopup";
import { useState } from "react";
import ExtraAction from "./ExtraAction";
import { Link } from "react-router-dom";
import { useFollowUnfollow } from "../../../hooks/react-query/query-hooks/followunfollow";
const Post = ({
  items,
  readableDate,
  user,
}: {
  items: PostType;
  readableDate: string;
  user: User | null;
}) => {
  const { mutate: mutateLike } = useLikeUnlike(items._id);
  const { mutate: mutatebookmark } = useAddRemovebookmark(items._id);
  const totalLikes = items.likes.length;
  const isLiked = items.likes.includes(user?._id || "");
  const isBookmarked = user?.bookmarks
    .map((item) => item._id)
    .includes(items._id);
  const [open, setOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { mutate: mutatefollowunfollow } = useFollowUnfollow(
    items.author._id as string
  );
  return (
    <>
      <Postpopup items={items} open={open} setOpen={setOpen} />
      <ExtraAction
        items={items}
        user={user}
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
      />
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl my-6">
        <div className="flex items-center px-4 py-3">
          <Link
            to={`${
              items.author._id === user?._id
                ? "/profile"
                : `/otheraccount/${items.author._id}`
            }`}
          >
            <img
              className="h-[50px] w-[50px] rounded-full object-cover"
              src={items.author.profilePicture?.url}
              alt="Profile"
            />
          </Link>

          <div className="ml-3">
            <p className="text-sm font-bold">
              {items.author.username}
              <span className="text-xs font-normal text-gray-500 pl-3">
                {user?._id === items.author._id ? " (Author)" : ""}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{readableDate}</p>
          </div>
          <div className="ml-auto flex gap-3">
            {user?._id !== items.author._id && (
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
            {user?._id === items.author._id && (
              <>
                <button
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setIsPopupOpen(true)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="px-4 pb-2">
          <p className="font-semibold">{items.caption}</p>
        </div>

        <img
          className="w-full object-cover sm:h-[585px] h-[300px] object-center rounded-2xl"
          src={items.contant.url}
          alt="Post image"
        />

        <div className="px-4 pt-2 flex items-center space-x-4">
          <button
            className={`${
              isLiked ? "text-red-500" : "text-black"
            } cursor-pointer`}
            onClick={() => mutateLike()}
          >
            {isLiked ? (
              <svg
                className="w-6 h-6"
                fill="currentColor"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
          <button
            className="text-gray-600 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z" />
            </svg>
          </button>
          <div className="ml-auto">
            <button
              className="text-black cursor-pointer"
              onClick={() => mutatebookmark()}
            >
              {isBookmarked ? (
                <>
                  <FaBookmark size={25} />
                </>
              ) : (
                <>
                  <CiBookmark size={25} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-4 py-2 text-sm">
          <p className="font-semibold">{totalLikes}</p>
          <p className="text-gray-800 mt-2">
            {items.comments.length > 0 && (
              <>{items.comments.map((item) => item.text)}</>
            )}{" "}
          </p>
          {items.comments.length > 0 && (
            <>
              <div
                className="text-sm text-gray-500 cursor-pointer my-4"
                onClick={() => setOpen(true)}
              >
                View all {items.comments.length} comments
              </div>
            </>
          )}
        </div>

        <Comment id={items._id} />
      </div>
    </>
  );
};

export default Post;
