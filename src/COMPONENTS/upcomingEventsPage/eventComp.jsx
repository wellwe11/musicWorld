import React, { useEffect, useState } from "react";
import classes from "./upcomingEvents.module.scss";
import TicketButton from "./ticketButton";

import playIcon from "./playIcons/play-button.png";
import pauseIcon from "./playIcons/pause-button.png";

import starIcon from "./playIcons/star.png";

import arrowDownIcon from "../defaultPage/searchInput/arrow_Down.png";

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

const EventImage = ({
  imageSrc,
  imageClicked,
  setImageClicked,
  clickedEvent,
  setClickedEvent,
  artistId,
}) => {
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
      onMouseEnter={() => handleImageHover().onHover()}
      onMouseLeave={() => handleImageHover().onLeave()}
    >
      <div
        className={classes.playButtonContainer}
        onClick={() => {
          handleImageClicked();
          setClickedEvent(artistId);
        }}
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
        {imageHover &&
          (imageClicked ? (
            <img className={classes.playPauseIcon} src={pauseIcon} alt="" />
          ) : (
            <img className={classes.playPauseIcon} src={playIcon} alt="" />
          ))}
        {imageClicked && (
          <img className={classes.playPauseIcon} src={pauseIcon} alt="" />
        )}
      </div>
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

const Event = React.memo(function Event({
  title,
  date,
  dateEnd,
  image,
  country,
  city,
  location,
  onClickLink,
  interestedArtists,
  setInterestedArtists,
  artist,
  clickedEvent,
  setClickedEvent,
  imageClicked,
  setImageClicked,
  artistId,
  event,
}) {
  const [showMoreDates, setShowMoreDates] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const createDate = (d) => {
    if (d) {
      const updatedDate = new Date(d);

      const dateDay = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      }).format(updatedDate);

      const year = new Date(d).getFullYear();
      const todaysYear = new Date().getFullYear();

      return { dateDay, year, todaysYear };
    }
  };

  const startDate = createDate(date);

  const handleIsFav = () => {
    const newFavStatus = !isFav;
    setIsFav(newFavStatus);

    if (newFavStatus && !interestedArtists?.includes(artist)) {
      setInterestedArtists((prevArtists) => [...prevArtists, event]);
    } else if (
      !newFavStatus &&
      interestedArtists?.some((a) => a?.artist.id.includes(artistId))
    ) {
      setInterestedArtists((artists) =>
        artists.filter((a) => a?.artist.id !== artistId)
      );
    }
  };

  useEffect(() => {
    if (interestedArtists || date) {
      if (interestedArtists?.some((a) => a?.artist.id.includes(artistId))) {
        setIsFav(true);
      } else {
        setIsFav(false);
      }
    }
  }, [interestedArtists, date]);

  return (
    <div className={classes.event}>
      <EventImage
        imageSrc={image}
        alt=""
        clickedEvent={clickedEvent}
        setClickedEvent={setClickedEvent}
        setImageClicked={setImageClicked}
        imageClicked={imageClicked}
        artistId={artistId}
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

        <div>
          <h3 className={classes.date}>
            {startDate.dateDay}{" "}
            {startDate.year !== startDate.todaysYear
              ? "- " + startDate.year
              : ""}{" "}
            <br />
          </h3>
          <h4
            className={classes.moreDatesText}
            onMouseEnter={() => setShowMoreDates(true)}
            onMouseLeave={() => setShowMoreDates(false)}
          >
            {dateEnd
              ? `${dateEnd.length} other event${
                  dateEnd.length > 1 ? "s" : ""
                } in ${country}`
              : ""}
            {dateEnd && (
              <img
                className={classes.moreDatesIcon}
                src={arrowDownIcon}
                alt=""
              />
            )}
          </h4>
          {dateEnd && showMoreDates && (
            <div
              className={classes.moreDates}
              onMouseEnter={() => setShowMoreDates(true)}
              onMouseLeave={() => setShowMoreDates(false)}
            >
              {dateEnd?.map((date) => (
                <h5 className={classes.moreDatesText}>
                  {createDate(date.event.dates.start.localDate).dateDay} -{" "}
                  {date.event._embedded.venues[0].city.name}
                </h5>
              ))}
            </div>
          )}
        </div>
        <TicketButton onClickLink={onClickLink} />
      </div>
    </div>
  );
});

export default Event;
