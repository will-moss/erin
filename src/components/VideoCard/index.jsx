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
        loop
        playsInline
      />
      <div className="bottom-controls">
        <div className="footer-left">
          <div className="footer-container">
            <div className="footer-left">
              <div className="text">
                <div className="ticker">
                  <FontAwesomeIcon icon={faFilm} style={{ width: "30px" }} />
                  <span>{title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
