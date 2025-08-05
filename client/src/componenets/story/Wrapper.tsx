import { useState } from "react";
import StoryViewer from "./StoryViewer";
import StoryThumbnail from "./StoryThumbnail";
import { Story } from "../../types";
import { useGetStory } from "../../../hooks/react-query/query-hooks/storyqueryhook";

const Wrapper = () => {
  const { data } = useGetStory();
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const handleThumbnailClick = (storyId: string) => {
    setSelectedStoryId(storyId);
    setShowStoryViewer(true);

    data?.map((story) =>
      story.id === storyId ? { ...story, seen: true } : story
    );
  };

  const handleCloseStoryViewer = () => {
    setShowStoryViewer(false);
    setSelectedStoryId(null);
  };

  return (
    <div className="max-w-lg m-auto">
      <div className="flex overflow-x-auto py-4">
        {data &&
          data.length > 0 &&
          data.map((story) => (
            <StoryThumbnail
              key={story.id}
              story={story}
              onClick={handleThumbnailClick}
            />
          ))}
      </div>

      {showStoryViewer && (
        <StoryViewer
          stories={data as Story[]}
          initialStoryId={selectedStoryId}
          onClose={handleCloseStoryViewer}
        />
      )}
    </div>
  );
};

export default Wrapper;
