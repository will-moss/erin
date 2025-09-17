// Dependencies
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Components
import BottomNavbar from "./components/BottomNavbar";
import VideoFeed from "./components/VideoFeed";

// Assets
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePrevious } from "@uidotdev/usehooks";
import BlacklistManager from "./components/BlacklistManager";
import BottomMetadata from "./components/BottomMetadata";
import PlaylistsViewer from "./components/PlaylistsViewer";
import PlaylistGallery from "./components/PlaylistGallery";
import "./App.css";
import SideControls from "./components/SideControls";

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
  const _getShareFragment = (url) => url.replace(window.PUBLIC_URL, "").split("?")[0];
  const _isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const _toAuthenticatedUrl = (url) => `${url}?hash=${secureHash}`;
  const _veryFirsPageTitle = useMemo(() => document.title, []);
  const _updatePageTitle = (video = null) => {
    if (video) {
      if (!_veryFirsPageTitle.includes("[VIDEO_TITLE]")) document.title = _veryFirsPageTitle;
      else document.title = _veryFirsPageTitle.replace("[VIDEO_TITLE]", video.title);
    } else if (window.USE_SECRET) document.title = "Erin - Authentication";
  };
  const _injectCustomStylesheet = () => {
    const node = document.createElement("link");

    node.type = "text/css";
    node.rel = "stylesheet";
    node.href = "/custom.css";

    document.head.appendChild(node);
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
  // Source : https://stackoverflow.com/questions/7449588/why-does-decodeuricomponent-lock-up-my-browser
  window._decodeURIComponentSafe = (s) => {
    if (!s) return s;
    return decodeURIComponent(s.replace(/%(?![0-9a-fA-F]+)/g, "%25"));
  };
  const _scrollDirection = document.querySelector("html").getAttribute("data-scroll-direction");

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

  // Member - Saves a { url , title , extension , filename , playlist , metadataURL  } dictionary for every video discovered
  // "allVideos" and "videos" differ in that "allVideos" hold all the files regardless of current playlist
  // while "videos" holds only the current playlist's videos ( = all videos if no playlist, or a segment of it if any )
  const [allVideos, setAllVideos] = useState([]);
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
    }
    // Retrieve metadata from the parent playlist if any
    else if (v && _freshPlaylists.current.some((p) => p.name === v.playlist && p.metadataURL)) {
      const _playlist = _freshPlaylists.current.find((p) => p.name === v.playlist);
      setCurrentVideoMetadata(_playlist.metadata);

      if (_playlist.metadata && _playlist.metadata.channel_title)
        _updatePageTitle({ title: _playlist.metadata.channel_title });
    } else {
      setCurrentVideoMetadata(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleVideoFinish = () => {
    if (!window.AUTOPLAY_ENABLED) return;
    document
      .querySelector(".feed")
      .scrollBy(
        _scrollDirection === "vertical"
          ? { top: 1, left: 0, behavior: "smooth" }
          : { top: 0, left: 1, behavior: "smooth" }
      );
  };

  // Member - Save playlists
  const [playlists, setPlaylists] = useState([]);
  const _playlistsMetadataLoaded = useRef(false);

  // An internal member used as a trick to get the latest playlists information
  // within the setCurrentVideoMetadata() callback
  const _freshPlaylists = useRef(playlists);
  useEffect(() => {
    _freshPlaylists.current = playlists;
  }, [playlists]);

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

  // Video side control - Share a link to the video
  const share = async () => {
    const videoMetadata = visibleVideos[currentVideoIndex];

    const shareData = {
      title: videoMetadata.title,
      url: window.location.origin + "?play=" + _getShareFragment(videoMetadata.url),
    };

    try {
      await navigator.share(shareData);
    } catch {}
  };

  // Video control - Blacklist
  const blacklist = () => {
    const video = visibleVideos[currentVideoIndex];
    _addToBlackList(video);

    if (currentVideoIndex === visibleVideos.length - 1 && visibleVideos.length > 1) {
      document
        .querySelector(".feed")
        .scrollBy(
          _scrollDirection === "vertical"
            ? { top: -1, left: 0, behavior: "smooth" }
            : { top: 0, left: -1, behavior: "smooth" }
        );
    } else {
      document
        .querySelector(".feed")
        .scrollBy(
          _scrollDirection === "vertical"
            ? { top: 1, left: 0, behavior: "smooth" }
            : { top: 0, left: 1, behavior: "smooth" }
        );
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

  // Video control - Toggle Play / Pause
  const [isPlaying, setIsPlaying] = useState(true);
  const togglePlayPause = () => {
    const currentVideo = document.querySelector(`video[data-index="${currentVideoIndex}"]`);
    if (!currentVideo) return;

    if (!currentVideo.paused) currentVideo.pause();
    else currentVideo.play();

    setIsPlaying(!isPlaying);
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

  // Member - Manage playlist gallery UI
  const [activePlaylistForGallery, setActivePlaylistForGallery] = useState({});
  const [playlistGalleryOpen, setPlaylistGalleryOpen] = useState(false);
  const openPlaylistGallery = (playlist) => {
    setActivePlaylistForGallery({
      name: playlist.name,
      videos: allVideos.filter(
        (_v) =>
          _v.playlist === playlist.name &&
          !_getBlacklist()
            .map((v) => v.url)
            .includes(_v.url)
      ),
      metadata: playlist.metadata,
    });
    setPlaylistGalleryOpen(true);
  };
  const hidePlaylistGallery = () => {
    setPlaylistGalleryOpen(false);
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
    return fetch(_toAuthenticatedUrl(`${window.PUBLIC_URL}/media/${encodeURIComponent(path)}`), {
      method: "GET",
      cache: "no-cache",
      headers: _makeHTTPHeaders(),
    })
      .then((r) => r.json())
      .then(
        (files) =>
          new Promise((res, rej) => {
            if (!files) return res([]);

            let _folders = files.filter((f) => f.is_dir);
            let _files = files
              .filter((f) => !f.is_dir)
              .map((f) => ({ ...f, url: `${path}${f.url.slice(2).trim()}` }));

            if (window.IGNORE_HIDDEN_PATHS) {
              _folders = _folders.filter((f) => !f.name.startsWith("."));
              _files = _files.filter((f) => !f.name.startsWith("."));
            }

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

      let _playlistsMetadataTracker = {};
      let _videoFiles = {};
      for (let i = 0; i < files.length; i++) {
        const current = files[i];
        const _id = current.name.split(".").at(0);

        if (!_id || current.is_dir) continue;

        // Case : Video file
        if (_isVideo(current)) {
          if (!_isSafari || (_isSafari && current.extension !== "ogg"))
            _videoFiles[_id] = {
              url: window._decodeURIComponentSafe(
                _toAuthenticatedUrl(`${window.PUBLIC_URL}/media/${current.url}`)
              ),
              filename: current.name,
              title: current.name
                .replaceAll("-", " ")
                .replaceAll("__", " - ")
                .split(".")
                .slice(0, -1)
                .join(""),
              extension: current.url.split(".").at(-1).toLowerCase(),
              // playlist: current.url.replace(current.name, ""),
              playlist: current.url.substr(0, current.url.lastIndexOf("/")),
              metadataURL: false,
            };

          continue;
        }

        // Case : Metadata file for a video
        if (_id in _videoFiles) {
          _videoFiles[_id].metadataURL = _toAuthenticatedUrl(
            `${window.PUBLIC_URL}/media/${current.url}`
          );
          continue;
        }

        // Case : Metadata file for a playlist
        if (_id === "metadata") {
          const _name = current.url.substr(0, current.url.lastIndexOf("/"));
          _playlistsMetadataTracker[_name] = _toAuthenticatedUrl(
            `${window.PUBLIC_URL}/media/${current.url}`
          );
        }
      }

      _videoFiles = Object.values(_videoFiles);
      try {
        _storeVideos(_videoFiles);
      } catch (_) {}

      // Record all videos for later use
      setAllVideos(_videoFiles);

      // Playlist extraction
      const _allPlaylists = [
        ...new Set(_videoFiles.map((v) => v.playlist).filter((p) => p)),
      ].sort();
      setPlaylists(
        _allPlaylists.map((_p) => ({
          name: _p,
          metadataURL: _playlistsMetadataTracker[_p] || false,
        }))
      );

      // Filter video files retrieved according to the current url-defined playlist
      let currentPlaylist = window._decodeURIComponentSafe(window.location.pathname.substring(1));
      if (currentPlaylist && currentPlaylist.substr(-1) === "/")
        currentPlaylist = currentPlaylist.substring(0, currentPlaylist.length - 1);

      if (currentPlaylist) {
        _videoFiles = _videoFiles.filter((v) => v.playlist === currentPlaylist);
        setActivePlaylistForGallery({ name: currentPlaylist, videos: _videoFiles });
      }

      // If any video is provided in the URL, make sure that it appears first ( = "share" feature )
      const query = new URLSearchParams(window.location.search);
      let currentVideoFromURL = null;
      if (query.has("play")) {
        const suppliedFragment = query.get("play");
        currentVideoFromURL = _videoFiles.find(
          (v) => _getShareFragment(v.url) === suppliedFragment
        );
        _videoFiles = _videoFiles.filter((v) => v.url !== currentVideoFromURL.url);
      }

      setVideos((freshVideos) => {
        if (!hasCache || currentPlaylist)
          return currentVideoFromURL
            ? [currentVideoFromURL, ..._shuffleArray(_videoFiles)]
            : _shuffleArray(_videoFiles);
        else if (hasCache && !_arraysAreEqual(_videoFiles, freshVideos))
          return currentVideoFromURL
            ? [
                currentVideoFromURL,
                ..._shuffleArray([
                  ...freshVideos.filter((f) => f.url !== currentVideoFromURL.url),
                  ..._videoFiles.filter((f) => !freshVideos.some((v) => v.url === f.url)),
                ]),
              ]
            : _shuffleArray([
                ...freshVideos,
                ..._videoFiles.filter((f) => !freshVideos.some((v) => v.url === f.url)),
              ]);
      });

      if (!hasCache) {
        setLoading(false);
      }
    });
  };

  // Hook - When a new video is focused, update its muted state, and assume it is playing internally
  useEffect(() => {
    const currentVideo = document.querySelector(`video[data-index="${currentVideoIndex}"]`);
    if (!currentVideo) return;
    currentVideo.muted = muted;
    setIsPlaying(true);
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

  // Hook - On mount
  // - Retrieve the locally-stored secret
  // - Attempt to hide the address bar
  // - Retrieve the cache if any
  // - Load the custom stylesheet if configured
  useEffect(() => {
    window.onload = () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
    };

    if (window.USE_CUSTOM_SKIN) _injectCustomStylesheet();

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

  // Hook - When the playlists are loaded
  // - Load all their metadata via async HTTP calls
  useEffect(() => {
    if (!playlists || playlists.length === 0) return;

    if (_playlistsMetadataLoaded.current) return;

    Promise.all(
      playlists.map((p) =>
        !p.metadataURL
          ? new Promise((res, rej) => res(p))
          : fetch(p.metadataURL, { method: "GET", headers: _makeHTTPHeaders() })
              .then((r) => r.json())
              .then((r) => ({ ...p, metadata: r }))
      )
    ).then((results) => {
      _playlistsMetadataLoaded.current = true;
      setPlaylists(results);

      // Force-refresh the video metadata after the playlists' metadata were loaded
      setTimeout(() => {
        handleVideoFocus(videos[currentVideoIndex], currentVideoIndex);
      }, 0);
    });
  }, [playlists]); // eslint-disable-line react-hooks/exhaustive-deps

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
                  isPlaying={isPlaying}
                  onBlacklist={blacklist}
                  onOpenBlacklist={openBlacklist}
                  onOpenPlaylistsViewer={openPlaylistsViewer}
                  onTogglePlayPause={togglePlayPause}
                />
                <SideControls onShare={share} />
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
                  onOpenPlaylistGallery={openPlaylistGallery}
                />
                <PlaylistGallery
                  visible={playlistGalleryOpen}
                  activePlaylist={activePlaylistForGallery}
                  onClose={hidePlaylistGallery}
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
