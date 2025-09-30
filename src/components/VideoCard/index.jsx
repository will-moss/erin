// Dependencies
import { useCallback, useRef } from "react";

// Assets
import "./index.css";

const VideoCard = ({ index, video, isLoaded, refForwarder, onDoubleClick }) => {
  const videoRef = useRef(null);

  // Handle click
  // - Seek forward / backward on double click
  const handleDoubleClick = (e) => {
    onDoubleClick(e);
  };

  const forward = useCallback((_ref) => {
    videoRef.current = _ref;
    refForwarder(_ref);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Safely encode only the filename part of the URL
  let safeUrl = null;
  if (isLoaded && video) {
    try {
      safeUrl = video.url.replace(video.filename, encodeURIComponent(video.filename));
    } catch (e) {
      console.error("Invalid URL in VideoCard:", video, e);
      safeUrl = encodeURI(video.url); // fallback to original
    }
  }

  return (
    <div className="video">
      <video
        className="player"
        data-index={index}
        src={safeUrl}
        ref={forward}
        onDoubleClick={handleDoubleClick}
        playsInline={true}
        muted={true}
        preload="auto"
      />
    </div>
  );
};

export default VideoCard;
