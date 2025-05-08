import { useEffect, useState } from "react";
import classes from "./upcomingEvents.module.scss";
import TicketButton from "./ticketButton";

import playIcon from "./playIcons/play-button.png";
import pauseIcon from "./playIcons/pause-button.png";

import starIcon from "./playIcons/star.png";

const AddToFollowingButton = ({ isFav }) => {
  return (
    <div className={classes.favoriteButton}>
      <button className={classes.starButton}>
        {isFav === true && (
          <img className={classes.starIconFaved} src={starIcon} alt="" />
        )}
        {isFav === false && (
          <img className={classes.starIcon} src={starIcon} alt="" />
        )}
      </button>
    </div>
  );
};

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
  interestedArtists,
  setInterestedArtists,
  artist,
}) => {
  const updatedDate = new Date(date);
  const dateDay = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  }).format(updatedDate);
  const year = new Date(date).getFullYear();

  const todaysYear = new Date().getFullYear();

  const [isFav, setIsFav] = useState(false);

  const handleIsFav = () => {
    const newFavStatus = !isFav;
    setIsFav(newFavStatus);

    if (newFavStatus && !interestedArtists?.includes(artist)) {
      console.log(1);
      setInterestedArtists((prevArtists) => [...prevArtists, artist]);
    } else if (!newFavStatus && interestedArtists?.includes(artist)) {
      console.log(2);
      setInterestedArtists((artists) => artists.filter((a) => a !== artist));
    }
  };

  useEffect(() => {
    if (interestedArtists?.includes(artist)) {
      setIsFav(true);
    } else {
      setIsFav(false);
    }
  }, [interestedArtists]);

  return (
    <div className={classes.event}>
      <EventImage
        imageSrc={image}
        alt=""
        imageClicked={imageClicked}
        setImageClicked={setImageClicked}
      />
      <div className={classes.subInfo}>
        <div className={classes.titleAndAddToFavs}>
          <h3 className={classes.title}>
            {title.length < 30 ? title : title.slice(0, 30) + "..."}
          </h3>
          <div onClick={handleIsFav}>
            <AddToFollowingButton isFav={isFav} />
          </div>
        </div>
        <h4 className={classes.location}>
          {city} {location ? "- " + location : ""}
        </h4>
        <br />
        <h3 className={classes.date}>
          {dateDay} {year !== todaysYear ? "- " + year : ""}
        </h3>
        <TicketButton onClickLink={onClickLink} />
      </div>
    </div>
  );
};

export default Event;
