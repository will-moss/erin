import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import MediaCard from "../MediaCard";
import "./index.css";

const VideoFeed = forwardRef(
  (
    {
      videos,
      initialIndex,
      jumpToEnd,
      jumpBackForward,
      muted,
      onFocusVideo,
      onFinishVideo,
      onPlaybackStateChange,
    },
    ref,
  ) => {
  const _bufferSize = 3;
  const normalizedInitialIndex =
    _bufferSize === videos.length ? 0 : initialIndex;

  // Member - Track the currently-visible media item (0-indexed)
  const currentMediaIndex = useRef(normalizedInitialIndex);

  // Member - Track the currently-visible stable card wrapper
  const currentMediaCard = useRef(null);

  // Member - References to feed UI elements
  const feedRef = useRef();
  const progressRef = useRef();
  const padRef = useRef();
  const scrubberRef = useRef();

  // Member - Save the three stable card wrappers in recycler order
  const cardRefs = useRef([]);
  const saveCardRef = (index) => (card) => {
    cardRefs.current[index] = card;
  };

  // Member - Image timeline and video listener state
  const imageAnimationFrame = useRef(null);
  const imageTimelineGeneration = useRef(0);
  const imageElapsedMs = useRef(0);
  const imageStartedAt = useRef(null);
  const imageIsPlaying = useRef(false);
  const videoListeners = useRef(new Map());
  const wasPlayingBeforeScrub = useRef(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  // Member - Current scroll direction
  const _scrollDirection = document
    .querySelector("html")
    .getAttribute("data-scroll-direction");

  // Member - Prevent double jump forward
  const hasJumpedForward = useRef(false);

  // Members - Fullscreen behavior
  const isInFullscreen = useRef(false);
  const fullscreenIsSafe = useRef(false);
  const timer = useRef();

  const imageDurationMs = window.IMAGE_DISPLAY_DURATION * 1000;

  const setProgress = (elapsed, duration) => {
    if (!progressRef.current || !Number.isFinite(duration) || duration <= 0)
      return;

    const progressRate = Math.max(0, Math.min(1, elapsed / duration));
    progressRef.current.style.width = `${progressRate * 100}%`;
  };

  const isFocusedCard = (card, index) =>
    currentMediaCard.current === card &&
    currentMediaIndex.current === index &&
    parseInt(card.dataset.index) === index;

  const isCardVisible = (card) => {
    if (!feedRef.current) return false;

    const cardRect = card.getBoundingClientRect();
    const feedRect = feedRef.current.getBoundingClientRect();
    if (_scrollDirection === "horizontal") {
      const visibleWidth =
        Math.min(cardRect.right, feedRect.right) -
        Math.max(cardRect.left, feedRect.left);
      return visibleWidth / cardRect.width >= 0.95;
    }

    const visibleHeight =
      Math.min(cardRect.bottom, feedRect.bottom) -
      Math.max(cardRect.top, feedRect.top);
    return visibleHeight / cardRect.height >= 0.95;
  };

  const stopImageTimeline = (freeze = true) => {
    imageTimelineGeneration.current += 1;
    if (imageAnimationFrame.current !== null) {
      cancelAnimationFrame(imageAnimationFrame.current);
      imageAnimationFrame.current = null;
    }

    if (freeze && imageIsPlaying.current && imageStartedAt.current !== null) {
      imageElapsedMs.current = Math.min(
        imageDurationMs,
        imageElapsedMs.current + performance.now() - imageStartedAt.current,
      );
    }

    imageStartedAt.current = null;
    imageIsPlaying.current = false;
  };

  const startImageTimeline = (reset = false) => {
    const card = currentMediaCard.current;
    const index = currentMediaIndex.current;
    if (!card || card.dataset.mediaType !== "image") return;

    stopImageTimeline(false);
    if (reset) imageElapsedMs.current = 0;

    imageIsPlaying.current = true;
    imageStartedAt.current = performance.now();
    onPlaybackStateChange(true);

    const generation = imageTimelineGeneration.current;
    const tick = (now) => {
      if (
        generation !== imageTimelineGeneration.current ||
        !isFocusedCard(card, index) ||
        card.dataset.mediaType !== "image"
      )
        return;

      const elapsed = imageElapsedMs.current + now - imageStartedAt.current;
      if (elapsed >= imageDurationMs) {
        stopImageTimeline(false);
        imageElapsedMs.current = 0;
        setProgress(0, imageDurationMs);
        onFinishVideo();

        if (isFocusedCard(card, index) && card.dataset.mediaType === "image")
          startImageTimeline();
        return;
      }

      setProgress(elapsed, imageDurationMs);
      imageAnimationFrame.current = requestAnimationFrame(tick);
    };

    imageAnimationFrame.current = requestAnimationFrame(tick);
  };

  const removeVideoListeners = (video) => {
    const listeners = videoListeners.current.get(video);
    if (!listeners) return;

    Object.entries(listeners).forEach(([eventName, listener]) => {
      video.removeEventListener(eventName, listener, true);
    });
    videoListeners.current.delete(video);
  };

  const stopCardPlayback = (card) => {
    if (!card) return;

    const video = card.querySelector("video");
    removeVideoListeners(video);
    video.pause();

    if (currentMediaCard.current === card && card.dataset.mediaType === "image")
      stopImageTimeline();
  };

  // Assign both initial and recycled cards through the same cleanup and loading path.
  const assignMedia = (card, index) => {
    if (!card) return;

    stopCardPlayback(card);

    const video = card.querySelector("video");
    const image = card.querySelector("img");
    video.removeAttribute("src");
    video.load();
    image.removeAttribute("src");

    const media = videos[index];
    card.dataset.index = index;
    card.dataset.mediaType = media ? media.type : "";
    video.hidden = !media || media.type !== "video";
    image.hidden = !media || media.type !== "image";

    if (!media) return;

    let safeUrl = media.url;
    try {
      safeUrl = media.url.replace(
        media.filename,
        encodeURIComponent(media.filename),
      );
    } catch (error) {
      console.error("Invalid URL in MediaCard:", media, error);
    }

    if (media.type === "image") {
      image.alt = media.title;
      image.src = safeUrl;
    } else {
      video.muted = mutedRef.current;
      video.src = safeUrl;
    }
  };

  const focusCard = (card, index) => {
    if (!videos[index] || parseInt(card.dataset.index) !== index) return;
    if (isFocusedCard(card, index)) return;

    const previousCard = currentMediaCard.current;
    if (previousCard) stopCardPlayback(previousCard);

    currentMediaCard.current = card;
    currentMediaIndex.current = index;
    setProgress(0, 1);
    onFocusVideo(videos[index], index);

    if (card.dataset.mediaType === "image") {
      imageElapsedMs.current = 0;
      startImageTimeline(true);
      return;
    }

    const video = card.querySelector("video");
    video.muted = mutedRef.current;

    const listeners = {
      timeupdate: (event) => {
        if (!isFocusedCard(card, index)) return;
        setProgress(event.target.currentTime, event.target.duration);
      },
      ended: (event) => {
        if (!isFocusedCard(card, index)) return;
        event.target.play().catch((_) => {
          if (isFocusedCard(card, index)) onPlaybackStateChange(false);
        });
        onFinishVideo();
      },
      play: () => {
        if (isFocusedCard(card, index)) onPlaybackStateChange(true);
      },
      pause: () => {
        if (isFocusedCard(card, index)) onPlaybackStateChange(false);
      },
    };

    if (window.VIDEO_START_POSITION !== "start") {
      listeners.loadedmetadata = (event) => {
        if (!isFocusedCard(card, index)) return;
        event.target.currentTime =
          window.VIDEO_START_POSITION === "middle"
            ? event.target.duration / 2
            : Math.random() * event.target.duration;
        event.target.removeEventListener(
          "loadedmetadata",
          listeners.loadedmetadata,
          true,
        );
      };
    }

    Object.entries(listeners).forEach(([eventName, listener]) => {
      video.addEventListener(eventName, listener, true);
    });
    videoListeners.current.set(video, listeners);

    if (listeners.loadedmetadata && video.readyState >= 1)
      listeners.loadedmetadata({ target: video });

    video.play().catch((_) => {
      if (isFocusedCard(card, index)) onPlaybackStateChange(false);
    });
  };

  const pausePlayback = () => {
    const card = currentMediaCard.current;
    if (!card) return;

    if (card.dataset.mediaType === "image") {
      stopImageTimeline();
      setProgress(imageElapsedMs.current, imageDurationMs);
      onPlaybackStateChange(false);
    } else {
      card.querySelector("video").pause();
    }
  };

  const playPlayback = () => {
    const card = currentMediaCard.current;
    if (!card) return;

    if (card.dataset.mediaType === "image") {
      if (imageElapsedMs.current >= imageDurationMs) imageElapsedMs.current = 0;
      startImageTimeline();
    } else {
      const video = card.querySelector("video");
      const index = currentMediaIndex.current;
      video.play().catch((_) => {
        if (isFocusedCard(card, index)) onPlaybackStateChange(false);
      });
    }
  };

  const togglePlayback = () => {
    const card = currentMediaCard.current;
    if (!card) return;

    if (card.dataset.mediaType === "image") {
      if (imageIsPlaying.current) pausePlayback();
      else playPlayback();
      return;
    }

    const video = card.querySelector("video");
    if (video.paused) playPlayback();
    else pausePlayback();
  };

  useImperativeHandle(ref, () => ({ togglePlayback }));

  // Hook - Keep the global mute setting applied to the focused video.
  useEffect(() => {
    const card = currentMediaCard.current;
    if (card && card.dataset.mediaType === "video")
      card.querySelector("video").muted = muted;
  }, [muted]);

  // Hook - On mount - Set the current scroll
  useEffect(() => {
    if (jumpToEnd)
      return feedRef.current.scrollBy(
        _scrollDirection === "vertical"
          ? { top: 1, left: 0 }
          : { top: 0, left: 1 },
      );
    if (jumpBackForward) {
      if (!hasJumpedForward.current) {
        hasJumpedForward.current = true;
        return feedRef.current.scrollBy(
          _scrollDirection === "vertical"
            ? { top: 1, left: 0 }
            : { top: 0, left: 1 },
        );
      }

      hasJumpedForward.current = false;
    }
  }, [normalizedInitialIndex, jumpBackForward, jumpToEnd, _scrollDirection]);

  // Hook - When media are loaded - Set up the stable-card scroll observer
  useEffect(() => {
    cardRefs.current.forEach((card, offset) => {
      assignMedia(card, normalizedInitialIndex + offset);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        let visibleEntry = null;

        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index);
          if (
            entry.isIntersecting &&
            isCardVisible(entry.target) &&
            videos[index] &&
            entry.target.dataset.mediaType === videos[index].type
          ) {
            visibleEntry = entry;
          } else if (
            !entry.isIntersecting &&
            currentMediaCard.current === entry.target
          ) {
            stopCardPlayback(entry.target);
            currentMediaCard.current = null;
          }
        });

        if (!visibleEntry) return;

        const card = visibleEntry.target;
        const currentIndex = parseInt(card.dataset.index);
        const previousIndex = currentMediaIndex.current;
        focusCard(card, currentIndex);

        if (videos.length <= 1 || previousIndex === currentIndex) return;

        const scrollDirection = currentIndex > previousIndex ? "next" : "prev";
        const cardRect = cardRefs.current[1].getBoundingClientRect();
        const padHeight = cardRect.height * (currentIndex - 1);
        const padWidth = cardRect.width * (currentIndex - 1);

        if (scrollDirection === "next") {
          if (currentIndex > 1 && currentIndex < videos.length - 1) {
            const firstCard = cardRefs.current.shift();
            cardRefs.current.push(firstCard);

            if (_scrollDirection === "vertical")
              padRef.current.style.height = `${padHeight}px`;
            else padRef.current.style.width = `${padWidth}px`;

            cardRefs.current[_bufferSize - 2].insertAdjacentElement(
              "afterend",
              firstCard,
            );
            assignMedia(firstCard, currentIndex + 1);
          }
        } else if (previousIndex > 1 && previousIndex < videos.length - 1) {
          const lastCard = cardRefs.current.at(-1);
          cardRefs.current.unshift(lastCard);
          cardRefs.current.splice(-1);

          cardRefs.current[1].insertAdjacentElement("beforebegin", lastCard);

          if (_scrollDirection === "vertical")
            padRef.current.style.height = `${padHeight}px`;
          else padRef.current.style.width = `${padWidth}px`;

          assignMedia(lastCard, currentIndex - 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.95 },
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      observer.disconnect();
      stopImageTimeline(false);
      cardRefs.current.forEach((card) => stopCardPlayback(card));
      currentMediaCard.current = null;
    };
  }, [videos]); // eslint-disable-line react-hooks/exhaustive-deps

  const seekBy = (seconds) => {
    const card = currentMediaCard.current;
    if (!card) return;

    if (card.dataset.mediaType === "image") {
      const currentElapsed = imageIsPlaying.current
        ? imageElapsedMs.current + performance.now() - imageStartedAt.current
        : imageElapsedMs.current;
      imageElapsedMs.current = Math.max(
        0,
        Math.min(imageDurationMs, currentElapsed + seconds * 1000),
      );
      if (imageIsPlaying.current) imageStartedAt.current = performance.now();
      setProgress(imageElapsedMs.current, imageDurationMs);
      return;
    }

    const video = card.querySelector("video");
    video.currentTime += seconds;
  };

  const handleKeyboardSeeking = (event) => {
    if (event.code === "ArrowRight") seekBy(5);
    else if (event.code === "ArrowLeft") seekBy(-5);
    else if (event.code === "ArrowDown")
      feedRef.current.scrollBy(
        _scrollDirection === "vertical"
          ? { top: 1, left: 0, behavior: "smooth" }
          : { top: 0, left: 1, behavior: "smooth" },
      );
    else if (event.code === "ArrowUp")
      feedRef.current.scrollBy(
        _scrollDirection === "vertical"
          ? { top: -1, left: 0, behavior: "smooth" }
          : { top: 0, left: -1, behavior: "smooth" },
      );
  };

  const toggleFullscreen = () => {
    const element = document.documentElement;
    const requestMethod =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullScreen;

    if (!isInFullscreen.current) {
      isInFullscreen.current = true;
      document.body.classList.add("fullscreen");
      requestMethod.call(element);
      setTimeout(() => {
        fullscreenIsSafe.current = true;
      }, 1000);
    } else {
      isInFullscreen.current = false;
      fullscreenIsSafe.current = false;
      document.body.classList.remove("fullscreen");
      if (timer.current) clearTimeout(timer.current);
      document.exitFullscreen();
    }
  };

  const handleMediaTapToSeek = (event) => {
    const fullWidth = event.currentTarget.offsetWidth;
    const firstThird = fullWidth / 3;
    const secondThird = (fullWidth / 3) * 2;

    if (event.clientX >= 0 && event.clientX <= firstThird) seekBy(-5);
    else if (event.clientX > firstThird && event.clientX <= secondThird)
      toggleFullscreen();
    else if (event.clientX > secondThird) seekBy(5);
  };

  const handleMouseMove = () => {
    if (!isInFullscreen.current || !fullscreenIsSafe.current) return;
    if (timer.current) clearTimeout(timer.current);

    document.body.classList.remove("fullscreen");
    timer.current = setTimeout(() => {
      document.body.classList.add("fullscreen");
    }, 3000);
  };

  const handleScrubStart = () => {
    scrubberRef.current.classList.add("is-dragged");
    const card = currentMediaCard.current;
    if (!card) return;

    wasPlayingBeforeScrub.current =
      card.dataset.mediaType === "image"
        ? imageIsPlaying.current
        : !card.querySelector("video").paused;
    pausePlayback();
  };

  const handleScrubDrag = (event) => {
    const card = currentMediaCard.current;
    if (!card) return;

    const { clientX } = event.changedTouches[0];
    const duration =
      card.dataset.mediaType === "image"
        ? window.IMAGE_DISPLAY_DURATION
        : card.querySelector("video").duration;
    const { width } = window.screen;
    let mappedTime = (clientX * duration) / width;
    mappedTime = Math.max(0, Math.min(duration, mappedTime));

    if (card.dataset.mediaType === "image")
      imageElapsedMs.current = mappedTime * 1000;
    else card.querySelector("video").currentTime = mappedTime;

    setProgress(mappedTime, duration);
  };

  const handleScrubEnd = () => {
    scrubberRef.current.classList.remove("is-dragged");
    if (wasPlayingBeforeScrub.current) playPlayback();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardSeeking);
    document.addEventListener("mousemove", handleMouseMove);

    const scrubber = scrubberRef.current;
    scrubber.addEventListener("touchstart", handleScrubStart);
    scrubber.addEventListener("touchmove", handleScrubDrag);
    scrubber.addEventListener("touchend", handleScrubEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyboardSeeking);
      document.removeEventListener("mousemove", handleMouseMove);
      scrubber.removeEventListener("touchstart", handleScrubStart);
      scrubber.removeEventListener("touchmove", handleScrubDrag);
      scrubber.removeEventListener("touchend", handleScrubEnd);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={feedRef} className="feed" key={new Date().getTime()}>
      <div ref={padRef} className="feed-pad-top"></div>
      {[...Array(Math.min(_bufferSize, videos.length)).keys()].map((slot) => (
        <MediaCard
          key={slot}
          onDoubleClick={handleMediaTapToSeek}
          refForwarder={saveCardRef(slot)}
        />
      ))}
      <div
        className={`video-track-progress ${window.PROGRESS_BAR_POSITION}`}
        ref={progressRef}
      >
        <button ref={scrubberRef} className="video-track-scrubber">
          <i />
        </button>
      </div>
    </div>
  );
  },
);

export default VideoFeed;
