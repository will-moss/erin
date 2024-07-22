// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { faFilm } from "@fortawesome/free-solid-svg-icons";

const BottomMetadata = ({ video }) => {
  return (
    <div className="bottom-metadata">
      <FontAwesomeIcon icon={faFilm} style={{ width: "30px" }} />
      <p>{video.title}</p>
    </div>
  );
};

export default BottomMetadata;
