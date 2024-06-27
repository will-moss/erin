// Assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const BottomNavbar = ({ isMuted, onToggleMute }) => {
  return (
    <div className="bottom-navbar">
      <button type="button" className="nav-item" onClick={onToggleMute}>
        <FontAwesomeIcon
          icon={!isMuted ? faVolumeUp : faVolumeMute}
          className="icon"
        />
      </button>
    </div>
  );
};

export default BottomNavbar;
