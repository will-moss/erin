// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { faFilm, faImage } from "@fortawesome/free-solid-svg-icons";

const BottomMetadata = ({ video, extraMetadata }) => {
  const prefix = video.type === "image" ? "image" : "video";
  const titleField = `${prefix}_title`;
  const captionField = `${prefix}_caption`;
  const linkField = `${prefix}_link`;
  const _metadata = {
    channel_image: extraMetadata && extraMetadata.channel_image,
    channel_name: extraMetadata && extraMetadata.channel_name,
    [titleField]:
      (extraMetadata && extraMetadata[titleField]) || video.title,
    [captionField]: extraMetadata && extraMetadata[captionField],
    [linkField]: extraMetadata && extraMetadata[linkField],
  };

  const handleClick = () => {
    if (!_metadata[linkField]) return;
    window.open(_metadata[linkField], "_blank").focus();
  };

  return (
    <div className="bottom-metadata">
      {_metadata.channel_image && _metadata.channel_name && (
        <div className="channel">
          <div className="avatar-wrapper">
            <img src={_metadata.channel_image} alt={_metadata.channel_name} />
          </div>
          <span>{_metadata.channel_name}</span>
        </div>
      )}
      {_metadata[captionField] && (
        <div
          className="video-caption"
          dangerouslySetInnerHTML={{ __html: _metadata[captionField] }}
        ></div>
      )}
      <div className="video-title" onClick={handleClick}>
        <FontAwesomeIcon
          icon={video.type === "image" ? faImage : faFilm}
          style={{ width: "30px" }}
        />
        <p>{_metadata[titleField]}</p>
      </div>
    </div>
  );
};

export default BottomMetadata;
