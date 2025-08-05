import { useState } from "react";
import { SingelUser } from "../../types";
import Usergetpost from "./Usergetpost";
import UserVideo from "./UserVideo";

const SingelProfilegetuserfeed = ({
  user,
  loading,
}: {
  user: SingelUser | undefined;
  loading: boolean;
}) => {
  const [active, Setactive] = useState("post");
  return (
    <>
      <div className="sm:mx-0 mx-2">
        <div className="flex justify-between">
          <div
            className={`w-[48%] border-2 border-black py-2 rounded-lg flex justify-center items-center cursor-pointer ${
              active === "post"
                ? "bg-black text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => Setactive("post")}
          >
            Post
          </div>
          <div
            className={`w-[48%] border-2 border-black py-2 rounded-lg flex justify-center items-center cursor-pointer ${
              active === "video"
                ? "bg-black text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => Setactive("video")}
          >
            Reels
          </div>
        </div>

        {(() => {
          switch (active) {
            case "post":
              return <Usergetpost user={user} loading={loading} />;
              break;

            case "video":
              return <UserVideo user={user} loading={loading} />;
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

export default SingelProfilegetuserfeed;
