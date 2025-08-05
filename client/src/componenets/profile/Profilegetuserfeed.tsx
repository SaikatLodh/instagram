import { useState } from "react";
import { User } from "../../types";
import Usergetpost from "./Usergetpost";
import Usergetbookmark from "./Usergetbookmark";
import UserVideo from "./UserVideo";

const Profilegetuserfeed = ({
  user,
  loading,
}: {
  user: User | null;
  loading: boolean;
}) => {
  const [active, Setactive] = useState("post");

  return (
    <>
      <div className="sm:mx-0 mx-2">
        <div className="flex justify-between gap-3">
          <div
            className={`w-[48%] border-2 border-black py-2 rounded-lg flex justify-center items-center cursor-pointer ${
              active === "post"
                ? "bg-black text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => Setactive("post")}
          >
            Posts
          </div>
          <div
            className={`w-[48%] border-2 border-black py-2 rounded-lg flex justify-center items-center cursor-pointer ${
              active === "reels"
                ? "bg-black text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => Setactive("reels")}
          >
            Rells
          </div>
          <div
            className={`w-[48%] border-2 border-black py-2 rounded-lg flex justify-center items-center cursor-pointer ${
              active === "bookmark"
                ? "bg-black text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => Setactive("bookmark")}
          >
            Bookmark
          </div>
        </div>

        {(() => {
          switch (active) {
            case "post":
              return <Usergetpost user={user} loading={loading} />;
              break;

            case "reels":
              return <UserVideo user={user} loading={loading} />;
              break;

            case "bookmark":
              return <Usergetbookmark user={user} loading={loading} />;
              break;

            default:
              return <Usergetpost user={user} loading={loading} />;
              break;
          }
        })()}
      </div>
    </>
  );
};

export default Profilegetuserfeed;
