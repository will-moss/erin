// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { faAngleRight, faClose } from "@fortawesome/free-solid-svg-icons";

const PlaylistsViewer = ({ visible, playlists, onClose, onOpenPlaylistGallery }) => {
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
              <div key={idx} className="playlists-viewer-entry">
                <a className="left" href={`/${encodeURI(p.name)}`}>
                  <p>
                    {!p.metadata || (p.metadata && !p.metadata.channel_name)
                      ? p.name
                      : p.metadata.channel_name}
                  </p>
                </a>
                <div className="right">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPlaylistGallery(p);
                    }}
                  >
                    <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                </div>
              </div>
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
