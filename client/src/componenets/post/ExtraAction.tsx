import React from "react";
import { PostType, User } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";
import { useDeletePost } from "../../../hooks/react-query/query-hooks/postqueryhooks";
import { useDeleteReels } from "../../../hooks/react-query/query-hooks/rellsqueryhook";

const ExtraAction = ({
  items,
  user,
  isPopupOpen,
  setIsPopupOpen,
}: {
  items: PostType | undefined;
  user: User | null;
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate, isPending } = useDeletePost();
  const { mutate: mutateReels, isPending: reelsPending } = useDeleteReels();
  return (
    <>
      {isPopupOpen && (
        <div
          className={`bg-[#0000004f] fixed left-0 top-0 flex justify-center items-center w-full h-full z-[99] ${
            isPopupOpen ? "block" : "hidden"
          }`}
        >
          <div className="w-[400px] bg-[white] rounded-[10px] p-[20px] text-center">
            <div className="flex flex-col gap-[3px]">
              {user?._id === items?.author?._id && (
                <>
                  {location.pathname === "/" ||
                  location.pathname === "/explore" ? (
                    <button
                      className="text-[20px] text-[#ff00009f] cursor-pointer"
                      onClick={() => mutate(items?._id as string)}
                      disabled={isPending}
                    >
                      {" "}
                      {isPending ? "Deleting..." : "Delete Post"}
                    </button>
                  ) : (
                    <button
                      className="text-[20px] text-[#ff00009f] cursor-pointer"
                      onClick={() => mutateReels(items?._id as string)}
                      disabled={reelsPending}
                    >
                      {" "}
                      {reelsPending ? "Deleting..." : "Delete Post"}
                    </button>
                  )}
                </>
              )}
              {user?._id === items?.author?._id && (
                <button
                  className="text-[20px] text-[#ff00009f] cursor-pointer"
                  onClick={() =>
                    navigate(
                      `${
                        location.pathname === "/" ||
                        location.pathname === "/explore"
                          ? `/updatepost/${items?._id}/?caption=${items?.caption}&contant=${items?.contant?.url}`
                          : `/updatereels/${items?._id}/?caption=${items?.caption}&contant=${items?.contant?.url}`
                      }`
                    )
                  }
                >
                  Edite Post
                </button>
              )}
              {user?._id !== items?.author?._id && (
                <button className="text-[20px]">Follow</button>
              )}
            </div>

            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-[15px] bg-[black] text-white px-10 py-2 rounded-lg cursor-pointer"
            >
              Cencel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtraAction;
