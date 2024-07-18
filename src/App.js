// Dependencies
import { useEffect, useState, useRef, useCallback } from "react";

// Components
import VideoCard from "./components/VideoCard";
import BottomNavbar from "./components/BottomNavbar";

// Assets
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  // Members - Form & Auth management
  const [autoconnect, setAutoconnect] = useState(false);
  const [hasEverSubmitted, setHasEverSubmitted] = useState(false);
  const [formSecret, setFormSecret] = useState("");
  const [secureHash, setSecureHash] = useState("");
  const handleInputSecret = (e) => setFormSecret(e.target.value);

  // Member - Determines whether we are able to communicate with the remote server
  const [loading, setLoading] = useState(false);
  const [hasReachedRemoteServer, setHasReachedRemoteServer] = useState(false);

  // Member - Saves a { url , title } dictionary for every video discovered
  const [videos, setVideos] = useState([]);

  // Member - Determines which videos are currently loaded and visible on screen
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  // Member - Determines whether the audio is currently muted
  const [muted, setMuted] = useState(true);
  const toggleMute = () => setMuted(!muted);

  // Video control - Download the current video
  const download = () => {
    const url = videos[0].url;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = url.split("/").pop();
    anchor.target = "_blank";

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };

  // Member - Saves a ref to every video element on the page
  const videoRefs = useRef([]);
  const saveVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  // Misc - General niceties
  const _reloadPage = (evt) => {
    evt.preventDefault();
    window.location.reload();
  };
  const _makeHTTPHeaders = () => {
    const headers = { Accept: "application/json" };
    if (window.USE_SECRET && !secureHash)
      headers["Authorization"] = `Basic ${btoa(`Erin:${formSecret}`)}`;
    return headers;
  };
  const _clearStoredSecret = () => {
    localStorage.removeItem("erin_secret");
  };
  const _storeSecret = (s) => {
    localStorage.setItem("erin_secret", s);
  };
  const _isVideo = (file) =>
    ["mp4", "ogg", "webm"].includes(file.name.toLowerCase().split(".").at(-1));
  const _toAuthenticatedUrl = (url) => `${url}?hash=${secureHash}`;

  // Method - Test connectivity with the remote server
  const attemptToReachRemoteServer = (evt) => {
    if (evt) evt.preventDefault();

    setLoading(true);

    if (evt) setHasEverSubmitted(true);

    fetch(`${window.PUBLIC_URL}/media/`, {
      method: "GET",
      cache: "no-cache",
      headers: _makeHTTPHeaders(),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((r) => {
        if (window.USE_SECRET) {
          _storeSecret(formSecret);
          setSecureHash(r.hash);
        }
        setHasReachedRemoteServer(true);
      })
      .catch((_) => {
        _clearStoredSecret();
        setHasReachedRemoteServer(false);
      })
      .finally((_) => {
        setLoading(false);
      });
  };

  // Method - Recursive video retrieval
  const _retrieveVideosRecursively = (path = "") => {
    return fetch(_toAuthenticatedUrl(`${window.PUBLIC_URL}/media/${path}`), {
      method: "GET",
      cache: "no-cache",
      headers: _makeHTTPHeaders(),
    })
      .then((r) => r.json())
      .then(
        (files) =>
          new Promise((res, rej) => {
            if (!files) return res([]);

            const _folders = files.filter((f) => f.is_dir);
            const _files = files
              .filter((f) => !f.is_dir)
              .map((f) => ({ ...f, url: `${path}${f.url.slice(2)}` }));

            const promises = _folders.map((f) => _retrieveVideosRecursively(`${path}${f.name}`));
            Promise.all(promises).then((results) => {
              res([...results.flat(), ..._files]);
            });
          })
      );
  };

  // Method - Retrieve all the video links
  const retrieveVideos = () => {
    setLoading(true);

    _retrieveVideosRecursively().then((files) => {
      if (!files) setLoading(false);

      setVideos(
        files
          .filter((f) => _isVideo(f))
          .map((v) => ({
            url: _toAuthenticatedUrl(`${window.PUBLIC_URL}/media/${v.url}`),
            title: v.name
              .replaceAll("-", " ")
              .replaceAll("__", " - ")
              .split(".")
              .slice(0, -1)
              .join(""),
          }))
          .sort((a, b) => 0.5 - Math.random())
      );
      // localStorage.setItem('erin_videos', )

      // Load the first two videos
      setVisibleIndexes([0, 1]);

      setLoading(false);
    });
  };

  // Hook - On mount - Retrieve the locally-stored secret and videos
  useEffect(() => {
    const storedVideos = localStorage.getItem("erin_videos");

    if (storedVideos) setVideos(JSON.parse(storedVideos));

    if (!window.USE_SECRET) {
      setAutoconnect(true);
      return;
    }

    const storedSecret = localStorage.getItem("erin_secret");

    if (!storedSecret || storedSecret.length === 0) return;

    setFormSecret(storedSecret);
    setAutoconnect(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hook - When locally-stored secret was retrieved - Auto-connect to the remote server
  useEffect(() => {
    if (!autoconnect) return;
    attemptToReachRemoteServer();
  }, [autoconnect]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hook - When the secure hash was retrieved ( = remote server reached and authenticated )
  useEffect(() => {
    if (hasReachedRemoteServer) retrieveVideos();
  }, [secureHash, hasReachedRemoteServer]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hook - When videos are loaded - Set up the UI scroll observer
  useEffect(() => {
    // Default observer options
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };

    // Listener called when scroll is performed
    const handleIntersection = (entries) => {
      // Trick to always retrieve fresh state, rather than closure-scoped one
      setVisibleIndexes((_visibleIndexes) => {
        let visibleIndex = false;

        entries.forEach((entry) => {
          const videoElement = entry.target;
          const currentIndex = parseInt(videoElement.getAttribute("data-index"));

          // Case when a video is scroll-snapped and occupies the screen
          if (entry.isIntersecting) {
            visibleIndex = currentIndex;
            videoElement.play();
          }
          // Case when a video is off-screen or being scrolled in / out of the screen
          else {
            if (!_visibleIndexes.includes(currentIndex)) return;
            videoElement.pause();
          }
        });

        if (visibleIndex === false) return _visibleIndexes;

        return [visibleIndex - 1, visibleIndex, visibleIndex + 1];
      });
    };

    // Set up the observer
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Attach the observer to every video component
    for (let i = 0; i < videoRefs.current.length; i++) observer.observe(videoRefs.current[i]);

    // Disconnect the observer when unmounting
    return () => {
      observer.disconnect();
    };
  }, [videos]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="screen">
      <div className="container">
        {/* STATE - Loading */}
        {loading && (
          <div className="loading-state">
            <FontAwesomeIcon icon={faCompactDisc} />
          </div>
        )}

        {!loading && (
          <>
            {/* STATE - Hasn't reached remote server */}
            {!hasReachedRemoteServer && (
              <>
                {window.USE_SECRET && (
                  <div className="login-state">
                    <div className="icon-wrapper">
                      <img src={`/logo.png`} alt="Erin logo" />
                    </div>
                    <h1>Welcome to Erin</h1>
                    <p>Let's connect and watch a few clips</p>
                    <form onSubmit={attemptToReachRemoteServer}>
                      <label htmlFor="password">Your password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Please fill in your secure password"
                        onInput={handleInputSecret}
                      />
                      <button type="submit">Connect</button>
                      {hasEverSubmitted && <p className="form-error">Wrong password</p>}
                    </form>
                  </div>
                )}
              </>
            )}

            {/* STATE - Reached remote server but no video was found */}
            {hasReachedRemoteServer && videos.length === 0 && (
              <div className="empty-state">
                <div className="icon-wrapper">
                  <img src={`/logo.png`} alt="Erin logo" />
                </div>
                <h1>Nothing to watch</h1>
                <p>No video was found on your remote server</p>
                <button type="button" onClick={_reloadPage}>
                  Refresh
                </button>
              </div>
            )}

            {/* STATE - Reached remote server and retrieved videos */}
            {hasReachedRemoteServer && videos.length > 0 && (
              <>
                {videos.map((video, index) => (
                  <VideoCard
                    key={index}
                    index={index}
                    title={video.title}
                    url={video.url}
                    isLoaded={visibleIndexes.includes(index)}
                    isMuted={muted}
                    refForwarder={saveVideoRef(index)}
                  />
                ))}
                <BottomNavbar
                  className="bottom-navbar"
                  onDownload={download}
                  onToggleMute={toggleMute}
                  isMuted={muted}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
