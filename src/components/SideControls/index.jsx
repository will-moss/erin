// Assets
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";

const SideControls = ({ onShare }) => {
  return (
    <div className="side-controls">
      <div className="inner">
        <button type="button" onClick={onShare}>
          <FontAwesomeIcon icon={faShare} />
          Share
        </button>
      </div>
    </div>
  );
};

export default SideControls;
