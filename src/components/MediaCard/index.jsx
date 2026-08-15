// Dependencies
import { useCallback, useRef } from "react";

// Assets
import "./index.css";

const MediaCard = ({ refForwarder, onDoubleClick }) => {
  const cardRef = useRef(null);

  const forward = useCallback((_ref) => {
    cardRef.current = _ref;
    refForwarder(_ref);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="media" ref={forward} onDoubleClick={onDoubleClick}>
      <video
        className="player media-video"
        playsInline={true}
        preload="auto"
        hidden
      />
      <img className="player media-image" alt="" hidden />
    </div>
  );
};

export default MediaCard;
