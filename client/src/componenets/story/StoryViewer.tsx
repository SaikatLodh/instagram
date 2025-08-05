import React, { useState, useEffect, useCallback } from "react";
import { Story } from "../../types";
import StoryCard from "./StoryCard";

interface StoryViewerProps {
  stories: Story[];
  initialStoryId: string | null;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialStoryId,
  onClose,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialStoryId) {
      const index = stories.findIndex((s) => s.id === initialStoryId);
      if (index !== -1) {
        setCurrentStoryIndex(index);
      }
    }
  }, [initialStoryId, stories]);

  const currentStory = stories[currentStoryIndex];

  const handleNextStory = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      onClose(); // All stories viewed
    }
  }, [currentStoryIndex, stories.length, onClose]);

  const handlePrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else {
      // Maybe close or do nothing if it's the first story
    }
  }, [currentStoryIndex]);

  const handlePause = useCallback((paused: boolean) => {
    setIsPaused(paused);
  }, []);

  if (currentStoryIndex === -1 || !currentStory) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-sm h-full max-h-[80vh] rounded-lg shadow-lg">
        {stories.map((story, index) => (
          <StoryCard
            key={story.id}
            story={story}
            isActive={index === currentStoryIndex && !isPaused}
            onNextContent={() => {
              // This is handled by StoryCard itself, when its content completes,
              // it calls its own onStoryEnd if it's the last content,
              // which then calls handleNextStory.
              // For individual content progression, StoryCard manages its own index.
            }}
            onPrevContent={() => {
              // If StoryCard's content index is 0, it asks to go to prev story
              if (stories[currentStoryIndex].contents.length > 1) {
                // Check if current story has multiple contents
                // StoryCard will handle moving to previous content internally.
                // If it's the first content of the current story, then handlePrevStory will be called.
                // This logic might need refinement based on exact UX.
              } else {
                handlePrevStory();
              }
            }}
            onStoryEnd={handleNextStory} // When the last content of a story ends
            onPause={handlePause}
          />
        ))}

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl z-50 cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;
