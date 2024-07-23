// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { faClose, faEye } from "@fortawesome/free-solid-svg-icons";

const BlacklistManager = ({ visible, videos, onClose, onUnmask }) => {
  return (
    <div className={`blacklist-manager ${visible ? "visible" : ""}`}>
      <div className="blacklist-inner">
        <div className="blacklist-header">
          <span>Masked videos</span>
        </div>
        <div className="blacklist-content">
          {/* EMPTY STATE */}
          {!videos ||
            (videos.length === 0 && (
              <div className="blacklist-placeholder">
                <p>You currently have no videos masked from your feed</p>
              </div>
            ))}

          {/* FULL STATE */}
          {videos &&
            videos.map((v) => (
              <div key={v.url} className="blacklist-entry">
                <div className="left">
                  <p>{v.title}</p>
                  <a href={v.url} target="_blank" rel="noreferrer">
                    View in a new tab
                  </a>
                </div>
                <div className="right">
                  <button
                    type="button"
                    onClick={() => {
                      onUnmask(v);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="blacklist-controls">
          <button type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlacklistManager;
