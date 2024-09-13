import { useEffect, useRef } from "react";
import VideoCard from "../VideoCard";
import "./index.css";

const VideoFeed = ({
  videos,
  initialIndex,
  jumpToEnd,
  jumpBackForward,
  onFocusVideo,
  onFinishVideo,
}) => {
  // Member - Track the currently-visible video (0-indexed)
  const currentVideoIndex = useRef(0);

  // Member - Track the currently-visible video element
  const currentVideoElement = useRef();

  // Member - Reference to the feed element
  const feedRef = useRef();

  // Member - Reference to the progress tracker
  const progressRef = useRef();

  // Member - Reference to the padding element
  const padRef = useRef();

  // Member - Saves a ref to every video element on the page
  const videoRefs = useRef([]);
  const saveVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  // Member - Number of videos to load at a time
  const _bufferSize = 3;

  // Member - Prevent double jump forward
  const hasJumpedForward = useRef(false);

  // Mechanism - On video end, call a listener to trigger autoscroll + autoplay if enabled + progress tracker
  const handleVideoTimeUpdate = (e) => {
    const progressRate = e.target.currentTime / (e.target.duration % 60);
    progressRef.current.style.transform = `scaleX(${progressRate})`;
  };
  const replayVideo = (e) => {
    e.target.play();
    onFinishVideo();
  };

  // Hook - On mount - Set the current scroll
  useEffect(() => {
    if (jumpToEnd) return feedRef.current.scrollBy({ top: 1, left: 0 });
    if (jumpBackForward) {
      if (!hasJumpedForward.current) {
        hasJumpedForward.current = true;
        return feedRef.current.scrollBy({ top: 1, left: 0 });
      }

      hasJumpedForward.current = false;
    }
  }, [initialIndex, jumpBackForward, jumpToEnd]);

  // Hook - When videos are loaded - Set up the UI scroll observer
  useEffect(() => {
    // Default observer options
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.95,
    };

    // Listener called when scroll is performed
    const handleIntersection = (entries) => {
      let visibleIndex = false;

      entries.forEach((entry) => {
        const videoElement = entry.target;
        const currentIndex = parseInt(videoElement.getAttribute("data-index"));

        // Case when a video is scroll-snapped and occupies the screen
        if (entry.isIntersecting) {
          visibleIndex = currentIndex;
          videoElement.play().catch((_) => {});
          onFocusVideo(videos[currentIndex], currentIndex);
          videoElement.addEventListener("timeupdate", handleVideoTimeUpdate, true);
          videoElement.addEventListener("ended", replayVideo, true);
          currentVideoElement.current = videoElement;
          progressRef.current.style.transform = `scaleX(0)`;
        }
        // Case when a video is off-screen or being scrolled in / out of the screen
        else {
          videoElement.pause();
          videoElement.removeEventListener("timeupdate", handleVideoTimeUpdate, true);
          videoElement.removeEventListener("ended", replayVideo, true);
        }
      });

      if (visibleIndex === false) return;
      if (videos.length <= 1) return;

      const previousIndex = currentVideoIndex.current;
      const currentIndex = visibleIndex;

      if (previousIndex === currentIndex) return;

      const scrollDirection = currentIndex > previousIndex ? "next" : "prev";

      const videoHeight = videoRefs.current[1].parentNode.getBoundingClientRect().height;
      const padHeight = videoHeight * (currentIndex - 1);

      currentVideoIndex.current = visibleIndex;

      // Update the DOM based on the scroll action performed

      // - Case when moved to the next video
      if (scrollDirection === "next") {
        if (currentIndex > 1 && currentIndex < videos.length - 1) {
          // The first video becomes the latest video, and all videos are shifted backwards once
          const firstElement = videoRefs.current.shift();
          videoRefs.current.push(firstElement);

          // - - The first element is moved from back to front in the DOM, to enable scroll
          padRef.current.style.height = `${padHeight}px`;
          videoRefs.current[_bufferSize - 2].parentNode.insertAdjacentElement(
            "afterend",
            firstElement.parentNode
          );

          // - - The first-has-become-last element is updated in the DOM
          firstElement.setAttribute("data-index", currentIndex + 1);
          firstElement.setAttribute("src", videos[currentIndex + 1].url);
        }
      }

      // - Case when moved to the previous video
      else if (scrollDirection === "prev") {
        if (previousIndex > 1 && previousIndex < videos.length - 1) {
          // The last video becomes the future first video, and all videos are shifted forwards once
          const lastElement = videoRefs.current.at(-1);
          videoRefs.current.unshift(lastElement);
          videoRefs.current.splice(-1);

          // - - The last element is moved from front to back in the DOM, to enable scroll
          videoRefs.current[1].parentNode.insertAdjacentElement(
            "beforebegin",
            lastElement.parentNode
          );
          padRef.current.style.height = `${padHeight}px`;

          // - - The last-has-become-first element is updated in the DOM
          lastElement.setAttribute("data-index", currentIndex - 1);
          lastElement.setAttribute("src", videos[currentIndex - 1].url);
        }
      }
    };

    // Set up the observer
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Attach the observer to every video component
    for (let i = 0; i < videoRefs.current.length; i++)
      if (videoRefs.current[i]) observer.observe(videoRefs.current[i]);

    // Disconnect the observer when unmounting
    return () => {
      observer.disconnect();
    };
  }, [videos]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hook - On very first mount - Set keyboard forward/backward shortcuts
  const handleKeyboardSeeking = (e) => {
    if (e.code === "ArrowRight") seekVideoForward();
    else if (e.code === "ArrowLeft") seekVideoBackward();
    else if (e.code === "ArrowDown")
      feedRef.current.scrollBy({ top: 1, left: 0, behavior: "smooth" });
    else if (e.code === "ArrowUp")
      feedRef.current.scrollBy({ top: -1, left: 0, behavior: "smooth" });
  };
  const seekVideoForward = () => {
    currentVideoElement.current.currentTime += 5;
  };
  const seekVideoBackward = () => {
    currentVideoElement.current.currentTime -= 5;
  };
  const handleVideoTapToSeek = (e) => {
    const halfWidth = e.target.offsetWidth / 2;

    if (e.clientX > halfWidth) seekVideoForward();
    else seekVideoBackward();
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardSeeking);
    return () => document.removeEventListener("keydown", handleKeyboardSeeking);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  initialIndex = _bufferSize === videos.length ? 0 : initialIndex;

  return (
    <div ref={feedRef} className="feed" key={new Date().getTime()}>
      <div ref={padRef} className="feed-pad-top"></div>
      {[...Array(Math.min(_bufferSize, videos.length)).keys()].map((k) => (
        <VideoCard
          key={k}
          index={k + initialIndex}
          url={videos[k + initialIndex] ? videos[k + initialIndex].url : ""}
          onDoubleClick={handleVideoTapToSeek}
          isLoaded={true}
          refForwarder={saveVideoRef(k)}
        />
      ))}
      <div className={`video-track-progress ${window.PROGRESS_BAR_POSITION}`} ref={progressRef} />
    </div>
  );
};

export default VideoFeed;
