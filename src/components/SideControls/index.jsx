// Assets
import "./index.css";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";

const SideControls = ({ onShare }) => {
  const [sharing, setSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [manualShareURL, setManualShareURL] = useState("");
  const statusTimeout = useRef(null);
  const manualShareInput = useRef(null);

  useEffect(() => {
    if (manualShareURL) {
      manualShareInput.current.focus();
      manualShareInput.current.select();
    }
  }, [manualShareURL]);

  useEffect(
    () => () => {
      clearTimeout(statusTimeout.current);
    },
    [],
  );

  const handleShare = async () => {
    setSharing(true);
    setShareStatus("");
    clearTimeout(statusTimeout.current);

    let result;
    try {
      result = await onShare();
    } catch {
      result = { status: "failed" };
    } finally {
      setSharing(false);
    }

    if (!result || result.status === "cancelled") return;

    if (result.status === "manual-copy") {
      setManualShareURL(result.url);
      return;
    }

    const messages = {
      shared: "Shared",
      copied: "Link copied",
      failed: "Unable to share",
    };
    setShareStatus(messages[result.status] || "Unable to share");
    statusTimeout.current = setTimeout(() => setShareStatus(""), 2500);
  };

  const closeManualShare = () => {
    setManualShareURL("");
  };

  return (
    <div className="side-controls">
      <div className="inner">
        <button type="button" onClick={handleShare} disabled={sharing}>
          <FontAwesomeIcon icon={faShare} />
          {sharing ? "Sharing…" : "Share"}
        </button>
      </div>

      <div className="share-status" role="status" aria-live="polite">
        {shareStatus}
      </div>

      {manualShareURL && (
        <div className="share-dialog-backdrop">
          <div
            className="share-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
          >
            <h2 id="share-dialog-title">Share link</h2>
            <p>Copy this link manually:</p>
            <input
              ref={manualShareInput}
              type="text"
              readOnly
              value={manualShareURL}
              aria-label="Share link"
              onFocus={(event) => event.target.select()}
            />
            <button type="button" onClick={closeManualShare}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideControls;
