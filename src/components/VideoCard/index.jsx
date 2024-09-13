// Dependencies
import { useCallback, useRef } from "react";

// Assets
import "./index.css";

const VideoCard = ({ index, url, isLoaded, refForwarder, onDoubleClick }) => {
  const videoRef = useRef(null);

  // Handle click
  // - Play / Pause on single click
  // - Seek forward / backward on double click
  const _doubleClickDelay = 200;
  let _preventSingleClickAction = false;
  let _timer = null;

  const handleClick = (e) => {
    _timer = setTimeout(function () {
      if (!_preventSingleClickAction) {
        if (videoRef.current.paused) videoRef.current.play();
        else videoRef.current.pause();
      }
      _preventSingleClickAction = false;
    }, _doubleClickDelay);
  };

  const handleDoubleClick = (e) => {
    clearTimeout(_timer);
    _preventSingleClickAction = true;
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
        src={isLoaded ? url : null}
        ref={forward}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        playsInline={true}
        muted={true}
        preload="auto"
      />
    </div>
  );
};

export default VideoCard;
