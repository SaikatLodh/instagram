import React from "react";
import { Story } from "../../types";

interface StoryThumbnailProps {
  story: Story;
  onClick: (storyId: string) => void;
}

const StoryThumbnail: React.FC<StoryThumbnailProps> = ({ story, onClick }) => {
  return (
    <div
      className={`flex flex-col items-center cursor-pointer mx-2`}
      onClick={() => onClick(story.id)}
    >
      <div
        className={`w-16 h-16 rounded-full p-[2px] ${
          story.seen
            ? "bg-gray-400"
            : "bg-gradient-to-tr from-yellow-400 to-fuchsia-600"
        }`}
      >
        <img
          src={story.userAvatar.url}
          alt={story.username}
          className="w-full h-full rounded-full object-cover border-2 border-white"
        />
      </div>
      <span className="text-xs mt-1 text-gray-800 truncate w-16 text-center">
        {story.username}
      </span>
    </div>
  );
};

export default StoryThumbnail;
