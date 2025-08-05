import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  duration: number; // in milliseconds
  isPlaying: boolean;
  onComplete: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  isPlaying,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0); // 0 to 100

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / duration) * 100;

      if (newProgress >= 100) {
        setProgress(100);
        onComplete();
      } else {
        setProgress(newProgress);
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration, isPlaying, onComplete]);

  // Reset progress when duration or isPlaying changes
  useEffect(() => {
    setProgress(0);
  }, [duration]);

  return (
    <div className="h-1 bg-gray-500/50 rounded-full overflow-hidden flex-grow mx-1">
      <div
        className="h-full bg-white rounded-full transition-transform duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
