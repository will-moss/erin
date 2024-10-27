// Dependencies
import { useCallback, useRef } from "react";

// Assets
import "./index.css";

const VideoCard = ({ index, url, isLoaded, refForwarder, onDoubleClick }) => {
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

  return (
    <div className="video">
      <video
        className="player"
        data-index={index}
        src={isLoaded ? encodeURI(url) : null}
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
