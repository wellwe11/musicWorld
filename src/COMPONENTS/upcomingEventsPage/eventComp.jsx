import { useEffect, useRef, useState } from "react";
import classes from "./upcomingEvents.module.scss";
import TicketButton from "./ticketButton";

import playIcon from "./playIcons/play-button.png";
import pauseIcon from "./playIcons/pause-button.png";

const EventImage = ({ imageSrc, imageClicked, setImageClicked }) => {
  const [imageHover, setImageHover] = useState(false);

  const handleImageClicked = () => {
    return imageClicked ? setImageClicked(false) : setImageClicked(true);
  };

  const handleImageHover = () => {
    const onHover = () => {
      setImageHover(true);
    };

    const onLeave = () => {
      setImageHover(false);
    };

    return {
      onHover,
      onLeave,
    };
  };

  useEffect(() => {
    if (imageClicked) {
      const timer = setTimeout(() => {
        setImageClicked(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [imageClicked]);

  // prevents the events to load play on mount
  useEffect(() => {
    setImageClicked(false);
  }, []);

  return (
    <div
      className={classes.eventImage}
      onClick={handleImageClicked}
      onMouseEnter={() => handleImageHover().onHover()}
      onMouseLeave={() => handleImageHover().onLeave()}
    >
      <svg height="130" width="130">
        {imageClicked ? (
          <circle
            className={classes.circle}
            cx="65"
            cy="65"
            r="55"
            stroke="#ffffff"
            strokeWidth="12"
            fill="none"
          />
        ) : (
          ""
        )}
      </svg>
      <div className={classes.logo}></div>
      {imageHover &&
        (imageClicked ? (
          <img className={classes.playPauseIcon} src={pauseIcon} alt="" />
        ) : (
          <img className={classes.playPauseIcon} src={playIcon} alt="" />
        ))}
      {imageClicked && (
        <img className={classes.playPauseIcon} src={pauseIcon} alt="" />
      )}
      <img
        className={`${classes.coverPhoto} ${
          imageHover || imageClicked ? classes.coverPhotoFaded : ""
        }`}
        src={imageSrc}
        alt=""
      />
    </div>
  );
};

const Event = ({
  title,
  date,
  image,
  country,
  city,
  location,
  imageClicked,
  setImageClicked,
  onClickLink,
}) => {
  console.log(title, title.length);
  return (
    <div className={classes.event}>
      <h1>{title.length < 18 ? title : title.slice(0, 17) + "..."}</h1>
      <EventImage
        imageSrc={image.url}
        alt=""
        imageClicked={imageClicked}
        setImageClicked={setImageClicked}
      />
      <div className={classes.subInfo}>
        <div>
          <h4>
            {country} - {city}
          </h4>
          <h5>{location}</h5>
        </div>
        <h3>{date}</h3>
        <TicketButton onClickLink={onClickLink} />
      </div>
    </div>
  );
};

export default Event;
