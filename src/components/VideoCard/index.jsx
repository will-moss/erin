// Dependencies
import { useRef } from "react";

// Assets
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

const VideoCard = ({ index, url, title, isLoaded, isMuted, refForwarder }) => {
  const videoRef = useRef(null);

  // Toggle play/pause on click
  const togglePause = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  return (
    <div className="video">
      <video
        data-index={index}
        className="player"
        src={isLoaded ? url : null}
        ref={(_ref) => {
          videoRef.current = _ref;
          refForwarder(_ref);
        }}
        onClick={togglePause}
        muted={isMuted}
        loop={true}
        playsInline={true}
        preload="auto"
      />
    </div>
  );
};

export default VideoCard;
