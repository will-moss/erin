// Dependencies
import { useCallback, useEffect, useMemo, useState } from "react";

// Components
import BottomNavbar from "./components/BottomNavbar";
import VideoFeed from "./components/VideoFeed";

// Assets
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePrevious } from "@uidotdev/usehooks";
import "./App.css";
import BlacklistManager from "./components/BlacklistManager";
import BottomMetadata from "./components/BottomMetadata";
import PlaylistsViewer from "./components/PlaylistViewer";

const App = () => {
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
  const _hasStoredVideos = () => {
    let v = localStorage.getItem("erin_videos");
    if (!v) return false;
    v = JSON.parse(v);
    if (!v || v.length === 0) return false;
    return true;
  };
  const _storeVideos = (v) => {
    localStorage.setItem("erin_videos", JSON.stringify(v));
  };
  const _getStoredVideos = () => {
    const v = localStorage.getItem("erin_videos");
    if (!v) return [];
    return JSON.parse(v);
  };
  const _getBlacklist = () => {
    const l = localStorage.getItem("erin_blacklist");
    if (!l) return [];
    return JSON.parse(l);
  };
  const _addToBlackList = (v) => {
    let l = _getBlacklist();
    l = [...l, v];
    localStorage.setItem("erin_blacklist", JSON.stringify(l));
  };
  const _removeFromBlacklist = (v) => {
    let l = _getBlacklist();
    l = l.filter((_v) => v.url !== _v.url);
    localStorage.setItem("erin_blacklist", JSON.stringify(l));
  };
  const _isVideo = (file) =>
    ["mp4", "ogg", "webm"].includes(file.name.toLowerCase().split(".").at(-1));
  const _isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const _toAuthenticatedUrl = (url) => `${url}?hash=${secureHash}`;
  const _veryFirsPageTitle = useMemo(() => document.title, []);
  const _updatePageTitle = (video = null) => {
    if (video) {
      if (!_veryFirsPageTitle.includes("[VIDEO_TITLE]")) document.title = _veryFirsPageTitle;
      else document.title = _veryFirsPageTitle.replace("[VIDEO_TITLE]", video.title);
    } else if (window.USE_SECRET) document.title = "Erin - Authentication";
  };
  const _arraysAreEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    const _a = [...a].sort();
    const _b = [...b].sort();

    for (let i = 0; i < _a.length; ++i) if (_a[i] !== _b[i]) return false;
    return true;
  };
  const _shuffleArray = (arr) => {
    const copy = [...arr];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  };

  // Members - Form & Auth management
  const [autoconnect, setAutoconnect] = useState(false);
  const [hasEverSubmitted, setHasEverSubmitted] = useState(false);
  const [formSecret, setFormSecret] = useState("");
  const [secureHash, setSecureHash] = useState("");
  const handleInputSecret = (e) => setFormSecret(e.target.value);

  // Members - Cache management
  const [hasCache, setHasCache] = useState(false);

  // Member - Determines whether we are able to communicate with the remote server
  const [loading, setLoading] = useState(false);
  const [hasReachedRemoteServer, setHasReachedRemoteServer] = useState(false);

  // Member - Determines whether the audio is currently muted
  const [muted, setMuted] = useState(true);
  const toggleMute = () => {
    const _newMuted = !muted;

    const currentVideo = document.querySelector(`video[data-index="${currentVideoIndex}"]`);
    currentVideo.muted = _newMuted;

    setMuted(!muted);
  };

  // Member - Saves a { url , title , extension , filename , metadataURL  } dictionary for every video discovered
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideoMetadata, setCurrentVideoMetadata] = useState(false);
  const previousVideoIndex = usePrevious(currentVideoIndex);
  const handleVideoFocus = useCallback((v, i) => {
    // Update the browser tab's title
    _updatePageTitle(v);

    // Refresh internal state
    setCurrentVideoIndex(i);

    // Fetch metadata if any
    if (v && v.metadataURL) {
      return fetch(v.metadataURL, {
        method: "GET",
        headers: _makeHTTPHeaders(),
      })
        .then((r) => r.json())
        .then((r) => {
          setCurrentVideoMetadata(r);

          if (r.video_title) _updatePageTitle({ title: r.video_title });
        });
    } else {
      setCurrentVideoMetadata(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleVideoFinish = () => {
    if (!window.AUTOPLAY_ENABLED) return;
    document.querySelector(".feed").scrollBy({ top: 1, left: 0, behavior: "smooth" });
  };

  // Member - Save playlists
  const [playlists, setPlaylists] = useState([]);

  // Member - Trick to trigger state updates on localStorage updates
  const [blackListUpdater, setBlacklistUpdater] = useState(0);

  // Dynamically-computed - Visible videos
  const visibleVideos = useMemo(
    () =>
      videos.filter(
        (_v) =>
          !_getBlacklist()
            .map((v) => v.url)
            .includes(_v.url)
      ),
    [videos, blackListUpdater] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Video control - Download the current video
  const download = () => {
    const url = visibleVideos[currentVideoIndex].url;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = url.split("?")[0].split("/").pop();
    anchor.target = "_blank";

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };

  // Video control - Blacklist
  const blacklist = () => {
    const video = visibleVideos[currentVideoIndex];
    _addToBlackList(video);

    if (currentVideoIndex === visibleVideos.length - 1 && visibleVideos.length > 1) {
      document.querySelector(".feed").scrollBy({ top: -1, left: 0, behavior: "smooth" });
    } else {
      document.querySelector(".feed").scrollBy({ top: 1, left: 0, behavior: "smooth" });
    }

    setTimeout(
      () => {
        setBlacklistUpdater(blackListUpdater + 1);

        // The last video is about to be removed - An array of 2 will become an array of 1
        if (visibleVideos.length === 2) setCurrentVideoIndex(0);
        // There are more than 2 videos, and we have removed one in the middle -> We adjust the current index
        else if (
          visibleVideos.length > 2 &&
          previousVideoIndex <= visibleVideos.length - 1 &&
          currentVideoIndex > 0 &&
          currentVideoIndex === visibleVideos.length - 2 &&
          previousVideoIndex > 0
        ) {
          setCurrentVideoIndex(currentVideoIndex - 1);
        }
      },

      // Show no delay when the last video is removed
      visibleVideos.length > 1 ? 800 : 0
    );
  };

  // Member - Manage blacklist UI
  const [blacklistOpen, setBlacklistOpen] = useState(false);
  const openBlacklist = () => {
    setBlacklistOpen(true);
  };
  const hideBlacklist = () => {
    setBlacklistOpen(false);
  };
  const removeFromBlacklist = (v) => {
    _removeFromBlacklist(v);
    setBlacklistUpdater(blackListUpdater + 1);
  };

  // Member - Manage playlist viewer UI
  const [playlistsViewerOpen, setPlaylistsViewerOpen] = useState(false);
  const openPlaylistsViewer = () => {
    setPlaylistsViewerOpen(true);
  };
  const hidePlaylistsViewer = () => {
    setPlaylistsViewerOpen(false);
  };

  // Method - Test connectivity with the remote server
  const attemptToReachRemoteServer = (evt) => {
    if (evt) evt.preventDefault();

    setLoading(true);

    if (evt) setHasEverSubmitted(true);

    fetch(`${window.PUBLIC_URL}/media/`, {
      method: "HEAD",
      cache: "no-cache",
      headers: _makeHTTPHeaders(),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r;
      })
      .then((r) => {
        if (window.USE_SECRET) {
          _storeSecret(formSecret);
          setSecureHash(r.headers.get("x-erin-hash"));
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
              .map((f) => ({ ...f, url: `${path}${f.url.slice(2).trim()}` }));

            const promises = _folders.map((f) => _retrieveVideosRecursively(`${path}${f.name}`));
            Promise.all(promises).then((results) => {
              res([...results.flat(), ..._files]);
            });
          })
      )
      .catch((_) => new Promise((res, rej) => res([])));
  };

  // Method - Retrieve all the video links (and generate the associated playlists based on folder structure)
  const retrieveVideos = () => {
    if (!hasCache) setLoading(true);

    _retrieveVideosRecursively().then((files) => {
      if (!files) setLoading(false);

      // Put the metadata (JSON) files at the end, to optimize looping order and prevent misses
      files.sort((a, b) => (a.name.endsWith(".json") ? 1 : -1));

      let _videoFiles = {};
      for (let i = 0; i < files.length; i++) {
        const current = files[i];
        const _id = current.name.split(".").at(0);

        if (!_id || current.is_dir) continue;

        // Case : Video file
        if (_isVideo(current)) {
          if (!_isSafari || (_isSafari && current.extension !== "ogg"))
            _videoFiles[_id] = {
              url: _toAuthenticatedUrl(`${window.PUBLIC_URL}/media/${current.url}`),
              filename: current.name,
              title: current.name
                .replaceAll("-", " ")
                .replaceAll("__", " - ")
                .split(".")
                .slice(0, -1)
                .join(""),
              extension: current.url.split(".").at(-1).toLowerCase(),
              playlist: current.url.replace(current.name, ""),
              metadataURL: false,
            };

          continue;
        }

        // Case : Metadata file
        if (_id in _videoFiles)
          _videoFiles[_id].metadataURL = _toAuthenticatedUrl(
            `${window.PUBLIC_URL}/media/${current.url}`
          );
      }

      _videoFiles = Object.values(_videoFiles);
      _storeVideos(_videoFiles);

      // Playlist extraction
      setPlaylists([...new Set(_videoFiles.map((v) => v.playlist).filter((p) => p))].sort());

      // Filter video files retrieved according to the current url-defined playlist
      let currentPlaylist = window.location.pathname.substring(1);
      if (currentPlaylist && currentPlaylist.substr(-1) !== "/") currentPlaylist += "/";
      _videoFiles = _videoFiles.filter((v) => v.playlist === currentPlaylist);

      setVideos((freshVideos) => {
        if (!hasCache || currentPlaylist) return _shuffleArray(_videoFiles);
        else if (hasCache && !_arraysAreEqual(_videoFiles, freshVideos))
          return _shuffleArray([
            ...freshVideos,
            ..._videoFiles.filter((f) => !freshVideos.some((v) => v.url === f.url)),
          ]);
      });

      if (!hasCache) {
        setLoading(false);
      }
    });
  };

  // Hook - When a new video is focused, update its muted state
  useEffect(() => {
    const currentVideo = document.querySelector(`video[data-index="${currentVideoIndex}"]`);
    if (!currentVideo) return;
    currentVideo.muted = muted;
  }, [currentVideoIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Memoized component - Video Feed
  const Feed = useMemo(
    () => {
      return (
        <VideoFeed
          key={blackListUpdater}
          initialIndex={
            currentVideoIndex > 0
              ? previousVideoIndex <= visibleVideos.length - 1 && previousVideoIndex > 0
                ? currentVideoIndex - 2
                : currentVideoIndex - 1
              : 0
          }
          jumpToEnd={
            previousVideoIndex === visibleVideos.length && visibleVideos.length > 1 ? true : false
          }
          jumpBackForward={previousVideoIndex !== visibleVideos.length && currentVideoIndex > 1}
          videos={visibleVideos}
          onFocusVideo={handleVideoFocus}
          onFinishVideo={handleVideoFinish}
        />
      );
    },
    [visibleVideos] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Hook - On mount - Retrieve the locally-stored secret / Attempt to hide the address bar / Retrieve the cache if any
  useEffect(() => {
    window.onload = () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
    };

    _updatePageTitle();

    if (_hasStoredVideos()) setHasCache(true);

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

  // Hook - When the remote server was reached and the user was authenticated - Retrieve the videos
  useEffect(() => {
    if (!hasReachedRemoteServer) return;

    if (hasCache) {
      setLoading(true);
      setVideos(_getStoredVideos());
      setLoading(false);
    }

    retrieveVideos();
  }, [secureHash, hasReachedRemoteServer]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {hasReachedRemoteServer && visibleVideos.length === 0 && (
              <div className="empty-state">
                <div className="icon-wrapper">
                  <img src={`/logo.png`} alt="Erin logo" />
                </div>
                <h1>Nothing to watch</h1>
                <p>No video was found on your remote server</p>
                <button type="button" onClick={_reloadPage}>
                  Refresh
                </button>

                {_getBlacklist().length > 0 && (
                  <>
                    <button type="button" className="btn-alternate" onClick={openBlacklist}>
                      Manage masked videos
                    </button>
                    <BlacklistManager
                      visible={blacklistOpen}
                      videos={_getBlacklist()}
                      onClose={hideBlacklist}
                      onUnmask={removeFromBlacklist}
                    />
                  </>
                )}
              </div>
            )}

            {/* STATE - Reached remote server and retrieved videos */}
            {hasReachedRemoteServer && visibleVideos.length > 0 && (
              <>
                {Feed}
                {visibleVideos[currentVideoIndex] && (
                  <BottomMetadata
                    video={visibleVideos[currentVideoIndex]}
                    extraMetadata={currentVideoMetadata}
                  />
                )}
                <BottomNavbar
                  onDownload={download}
                  onToggleMute={toggleMute}
                  isMuted={muted}
                  onBlacklist={blacklist}
                  onOpenBlacklist={openBlacklist}
                  onOpenPlaylistsViewer={openPlaylistsViewer}
                />
                <BlacklistManager
                  visible={blacklistOpen}
                  videos={_getBlacklist()}
                  onClose={hideBlacklist}
                  onUnmask={removeFromBlacklist}
                />
                <PlaylistsViewer
                  visible={playlistsViewerOpen}
                  playlists={playlists}
                  onClose={hidePlaylistsViewer}
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
