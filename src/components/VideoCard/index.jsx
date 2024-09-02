// Dependencies
import { useCallback, useRef } from "react";

// Assets
import "./index.css";

const VideoCard = ({ index, url, isLoaded, refForwarder }) => {
  const videoRef = useRef(null);

  // Toggle play/pause on click
  const togglePause = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
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
        src={isLoaded ? url : null}
        ref={forward}
        onClick={togglePause}
        playsInline={true}
        muted={true}
        preload="auto"
      />
    </div>
  );
};

export default VideoCard;
