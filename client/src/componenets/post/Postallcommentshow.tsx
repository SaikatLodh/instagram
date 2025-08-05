import { useSelector } from "react-redux";
import { PostType } from "../../types";
import Comment from "../comment/Comment";
import { RootState } from "../../../store/store";
import { useFollowUnfollow } from "../../../hooks/react-query/query-hooks/followunfollow";
import { useState } from "react";
import ExtraAction from "./ExtraAction";

const Postallcommentshow = ({ items }: { items: PostType | undefined }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate: mutatefollowunfollow } = useFollowUnfollow(
    items?.author._id as string
  );
  return (
    <>
      <ExtraAction
        items={items}
        user={user}
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
      />
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center space-x-2 p-4 bg-card rounded-lg shadow-md">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={items?.author?.profilePicture?.url}
            alt="Profile Picture"
          />
          <div className="flex-1">
            <span className="text-foreground font-semibold">
              {items?.author?.username}
            </span>
          </div>
          <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 rounded">
            {user?._id !== items?.author._id && (
              <>
                <h6
                  className="text-[#86a6fd] cursor-pointer"
                  onClick={() => mutatefollowunfollow()}
                >
                  {items?.author.followers.includes(user?._id as string)
                    ? "Following"
                    : "Follow"}
                </h6>
              </>
            )}
          </button>
          {user?._id === items?.author._id && (
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

        <div className="flex flex-col gap-5 overflow-y-scroll h-[100%] mt-5">
          {items?.comments &&
            items?.comments.length > 0 &&
            [...items.comments]?.reverse()?.map((item) => {
              const isoString = items.createdAt;
              const date = new Date(isoString);
              const readableDate = date.toLocaleString();
              return (
                <>
                  <div key={item._id}>
                    <div className="sm:flex p-4 bg-card rounded-lg shadow-md items-center gap-10">
                      <div className="flex items-center gap-3">
                        <img
                          aria-hidden="true"
                          alt="User Avatar"
                          src={item.author.profilePicture?.url}
                          className="rounded-full w-10 h-10 object-cover"
                        />
                        <div className="">
                          <p className="font-semibold text-primary">
                            {item.author.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {readableDate}
                          </p>
                        </div>
                      </div>

                      <div className=" overflow-y-auto sm:mt-0 mt-3">
                        <div>
                          <p>{item.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </div>

        <Comment id={items?._id as string} />
      </div>
    </>
  );
};

export default Postallcommentshow;
