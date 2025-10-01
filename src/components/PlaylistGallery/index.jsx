// Assets
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCompactDisc, faPlay } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const PlaylistGallery = ({ visible, activePlaylist, onClose }) => {
  const videoRefs = useRef([]);

  // Hook - On visibility change - Setup the whole lazy video thumbnail generation
  useEffect(() => {
    if (!visible) return;

    // Given a video HTML node and an URL, generate a thumbnail for that video
    const loadThumbnail = (video, videoSrc) => {
      const tempVideo = document.createElement("video");
      tempVideo.src = videoSrc;
      tempVideo.crossOrigin = "anonymous";
      tempVideo.muted = true;
      tempVideo.preload = "auto";

      tempVideo.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = tempVideo.videoWidth;
        canvas.height = tempVideo.videoHeight;
        const ctx = canvas.getContext("2d");

        tempVideo.currentTime = 0.1;
        tempVideo.addEventListener("seeked", () => {
          ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
          video.poster = canvas.toDataURL("image/jpeg");

          tempVideo.remove();
          canvas.remove();
        });
      });
    };

    // Setup the intersection observer to generate only the thumbnails visible in the viewport
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target;
            if (!video.poster) loadThumbnail(video, video.dataset.src);
            obs.unobserve(video);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Attach the intersection observer to all our video elements
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [visible]);

  return !visible ? null : (
    <div className={`playlist-gallery ${visible ? "visible" : ""}`}>
      <div className="playlist-gallery-inner">
        <div className="playlist-gallery-header">
          <span>Playlist</span>
        </div>
        <div className="playlist-gallery-content">
          <div className="playlist-header">
            <div className="avatar-wrapper">
              {!activePlaylist.metadata ||
              (activePlaylist.metadata && !activePlaylist.metadata.channel_image) ? (
                <FontAwesomeIcon icon={faCompactDisc} />
              ) : (
                <img src={activePlaylist.metadata.channel_image} alt="Playlist Channel Avatar" />
              )}
            </div>
            <div className="playlist-info">
              <span className="playlist-title">
                {!activePlaylist.metadata ||
                (activePlaylist.metadata && !activePlaylist.metadata.channel_name)
                  ? activePlaylist.name
                  : activePlaylist.metadata.channel_name}
              </span>
              <span className="playlist-media-count">
                {activePlaylist.videos.length} video{activePlaylist.videos.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="playlist-media">
            {activePlaylist.videos.map((v, idx) => (
              <a
                key={idx}
                className="playlist-video-wrapper"
                href={`/${encodeURIComponent(activePlaylist.name)}?play=${encodeURIComponent(
                  v.filename
                )}`}
              >
                <video
                  preload="none"
                  data-src={v.url.replace(v.filename, encodeURIComponent(v.filename))}
                  playsInline={false}
                  muted={true}
                  ref={(el) => (videoRefs.current[idx] = el)}
                ></video>
              </a>
            ))}
          </div>
        </div>
        <div className="playlist-gallery-controls">
          <button type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          <a href={`/${encodeURIComponent(activePlaylist.name)}`}>
            <FontAwesomeIcon icon={faPlay} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlaylistGallery;
