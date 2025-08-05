import React, { useRef, useState, useEffect } from "react";
import { Story } from "../../types";
import ProgressBar from "./ProgressBar";
import { Link } from "react-router-dom";

interface StoryCardProps {
  story: Story;
  isActive: boolean; // Is this the currently visible story?
  onNextContent: () => void;
  onPrevContent: () => void;
  onStoryEnd: () => void;
  onPause: (paused: boolean) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  isActive,
  onPrevContent,
  onStoryEnd,
  onPause,
}) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentContent = story.contents[currentContentIndex];
  const isPlaying = isActive; // Story plays only when active

  const handleContentComplete = () => {
    if (currentContentIndex < story.contents.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else {
      onStoryEnd();
    }
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentContentIndex > 0) {
      setCurrentContentIndex((prev) => prev - 1);
    } else {
      onPrevContent();
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleContentComplete();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPause(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPause(false);
  };

  // Handle video play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && currentContent.type === "video") {
        videoRef.current
          .play()
          .catch((e) => console.error("Error playing video:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentContent]);

  // Reset content index when story changes
  useEffect(() => {
    if (isActive) {
      setCurrentContentIndex(0);
    }
  }, [story.id, isActive]);

  const defaultImageDuration = 5000; // 5 seconds for images

  return (
    <div
      className={`absolute inset-0 w-full h-full bg-black rounded-lg overflow-hidden flex flex-col transition-opacity duration-300 ${
        isActive ? "opacity-100 z-10" : "opacity-0 -z-10"
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => onPause(false)} // Resume if mouse leaves while paused
    >
      {/* Progress Bars */}
      <div className="flex p-2 absolute top-0 left-0 right-0 z-20">
        {story.contents.map((_, index) => (
          <ProgressBar
            key={index}
            duration={
              currentContent.type === "video" && currentContentIndex === index
                ? (videoRef.current?.duration || 0) * 1000 // Use actual video duration if available
                : currentContent.duration || defaultImageDuration
            }
            isPlaying={isPlaying && currentContentIndex === index}
            onComplete={handleContentComplete}
          />
        ))}
      </div>

      {/* User Info */}
      <Link to={`/otheraccount/${story?.userId}`}>
        <div className="absolute top-8 left-0 right-0 z-20 flex items-center p-2 text-white">
          <img
            src={story.userAvatar.url}
            alt={story.username}
            className="w-8 h-8 rounded-full border-2 border-white mr-2"
          />
          <span className="font-semibold">{story.username}</span>
        </div>
      </Link>

      {/* Content Display */}
      <div className="flex-grow flex items-center justify-center relative">
        {currentContent.type === "image" && (
          <img
            src={currentContent.url}
            alt="Story content"
            className="max-w-full max-h-full object-contain"
          />
        )}
        {currentContent.type === "video" && (
          <video
            ref={videoRef}
            src={currentContent.url}
            className="max-w-full max-h-full object-contain"
            onEnded={handleContentComplete}
            preload="auto"
            muted // Muted by default for autoplay, user can unmute
          />
        )}
      </div>

      {/* Navigation Areas */}
      <div className="absolute inset-0 flex">
        <div className="w-1/3 h-full" onClick={handlePrevClick}></div>
        <div className="w-2/3 h-full" onClick={handleNextClick}></div>
      </div>
    </div>
  );
};

export default StoryCard;
