// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const PlaylistsViewer = ({ visible, playlists, onClose }) => {
  return (
    <div className={`playlists-viewer ${visible ? "visible" : ""}`}>
      <div className="playlists-viewer-inner">
        <div className="playlists-viewer-header">
          <span>Playlists</span>
        </div>
        <div className="playlists-viewer-content">
          <a className="playlists-viewer-entry" href={`/`}>
            <div className="left">
              <p>All media</p>
            </div>
          </a>
          {/* FULL STATE */}
          {playlists &&
            playlists.map((p, idx) => (
              <a key={idx} className="playlists-viewer-entry" href={`/${p}`}>
                <div className="left">
                  <p>{p}</p>
                </div>
              </a>
            ))}
        </div>
        <div className="playlists-viewer-controls">
          <button type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistsViewer;
