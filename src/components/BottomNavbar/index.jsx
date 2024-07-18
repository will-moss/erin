// Assets
import { faDownload, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

const BottomNavbar = ({ isMuted, onToggleMute, onDownload }) => {
  return (
    <div className="bottom-navbar">
      <button type="button" className="nav-item" onClick={onDownload}>
        <FontAwesomeIcon icon={faDownload} className="icon" />
      </button>
      <button type="button" className="nav-item" onClick={onToggleMute}>
        <FontAwesomeIcon icon={!isMuted ? faVolumeUp : faVolumeMute} className="icon" />
      </button>
    </div>
  );
};

export default BottomNavbar;
