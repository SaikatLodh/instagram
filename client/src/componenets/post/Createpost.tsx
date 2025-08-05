import React, { useState } from "react";
import PostForm from "./PostForm";
import CreateReels from "../reels/CreateReels";
import CreateStory from "../story/CreateStory";

const Createpost: React.FC = () => {
  const [active, Setactive] = useState("post");
  // Watch the file input to generate a preview

  return (
    <div className="sm:min-h-screen min-h-[90vh] flex items-center justify-center bg-white">
      <div className=" xl:w-[40%] lg:w-[50%] w-[90%]  flex justify-center items-center flex-col">
        <div className="flex justify-between gap-3 w-full mb-8">
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
              active === "story"
                ? "bg-black text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => Setactive("story")}
          >
            Story
          </div>
        </div>

        {(() => {
          switch (active) {
            case "post":
              return <PostForm />;
              break;

            case "reels":
              return <CreateReels />;
              break;

            case "story":
              return <CreateStory />;
              break;

            default:
              return <PostForm />;
              break;
          }
        })()}
      </div>
    </div>
  );
};

export default Createpost;
