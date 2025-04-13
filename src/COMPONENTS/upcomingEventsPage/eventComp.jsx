import { useEffect, useRef, useState } from "react";
import classes from "./upcomingEvents.module.scss";
import TicketButton from "./ticketButton";

import playIcon from "./playIcons/play-button.png";
import pauseIcon from "./playIcons/music-player.png";

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
      setTimeout(() => {
        setImageClicked(false);
      }, 4000);
    }
  }, [imageClicked]);

  return (
    <div
      className={classes.eventImage}
      onClick={handleImageClicked}
      onMouseEnter={() => handleImageHover().onHover()}
      onMouseLeave={() => handleImageHover().onLeave()}
    >
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
}) => {
  return (
    <div className={classes.event}>
      <h1>{title}</h1>
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
        <TicketButton />
      </div>
    </div>
  );
};

export default Event;
