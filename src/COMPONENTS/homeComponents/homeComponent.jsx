import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./homeComponent.module.scss";
import { findFittingImage } from "../../PAGES/functions/findFittingImage";
import BandText from "./pictureSliderTexts";

import buttonClickArrow from "./images/arrow-right.png";

const EventsImagesWheel = ({ eventsArray }) => {
  const [displayEvents, setDisplayEvents] = useState([]);

  const [isHovering, setIsHovering] = useState(false);

  const [displayedImage, setDisplayedImage] = useState(0);

  useEffect(() => {
    if (!isHovering) {
      const timer = setTimeout(() => {
        setDisplayedImage((prev) => (prev < 5 ? prev + 1 : 0));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [displayedImage, isHovering]);

  useEffect(() => {
    console.log(displayedImage);
  }, [displayedImage]);

  const amountOfEventsDisplay = useMemo(() => {
    return eventsArray.map((event, index) => {
      const eventsImages = event?.images.filter(
        (image) => image.ratio === "16_9" && image.height > 1000
      );
      return eventsImages;
    });
  }, [eventsArray]);

  useEffect(() => {
    setDisplayEvents(amountOfEventsDisplay);
  }, [eventsArray]);

  const logStuff = (e) => {
    console.log(e);
  };

  const displayedImageAdd = () => {
    setDisplayedImage((prev) => (prev < 5 ? prev + 1 : 0));
  };

  const displayedImageMinus = () => {
    setDisplayedImage((prev) => (prev > 0 ? prev - 1 : 5));
  };

  return (
    <div
      className={classes.pictureSliderContainer}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayEvents &&
        displayEvents.map(
          (event, index) =>
            index < 6 &&
            index === displayedImage && (
              <div
                key={index}
                className={`${classes.pictureSliderImage} ${
                  index === displayedImage ? classes.displayedImage : ""
                }`}
              >
                <button onClick={displayedImageMinus}>Prev</button>
                <div
                  className={classes.imageContainer}
                  onClick={() => logStuff(event)}
                >
                  <img src={event?.[0]?.url} alt="" />

                  <BandText data={eventsArray[index]} index={index} />
                </div>
                <button onClick={displayedImageAdd}>Next</button>
              </div>
            )
        )}
    </div>
  );
};

const ArtistProfile = ({ data }) => {
  console.log(data);

  const artist = data?._embedded?.attractions?.[0];
  return (
    <div className={classes.artistWrapper}>
      <div className={classes.imageContainer}>Image of artist</div>
      <div className={classes.artistTitle}>
        <h4>{artist?.name}</h4>
      </div>
    </div>
  );
};

const ArrowButton = ({ side, clickFn }) => {
  return (
    <button className={classes.arrowButton} onClick={clickFn}>
      <img
        src={buttonClickArrow}
        alt=""
        style={{ transform: side === "left" ? "rotate(180deg)" : "" }}
      />
    </button>
  );
};

const PopularArtistsNear = ({ data }) => {
  const scrollRef = useRef();

  const scroller = (direction) => {
    if (direction === "right") {
      console.log(direction);
      scrollRef.current.scrollBy({
        left: 500,
      });
    }

    if (direction === "left") {
      console.log(direction);
      scrollRef.current.scrollBy({
        left: -500,
      });
    }
  };

  return (
    <div className={classes.popularArtistsContainer}>
      <h2 className={classes.artistsNearTitle}>{"Artists near you..."}</h2>
      <div className={classes.arrayAndButtons}>
        <ArrowButton side={"left"} clickFn={() => scroller("left")} />
        <div className={classes.popularArtistsWrapper} ref={scrollRef}>
          {[...Array(15)].map((_, index) => (
            <div key={index} className={classes.artistProfileMapContainer}>
              <ArtistProfile data={data[index]} />
            </div>
          ))}
        </div>
        <ArrowButton side={"right"} clickFn={() => scroller("right")} />
      </div>
    </div>
  );
};

const HomePageComponent = ({ eventsArray }) => {
  const isLoggedIn = false;

  const favoritedArtists = [];
  return (
    <div className={classes.homePageComponentContainer}>
      <PopularArtistsNear data={eventsArray} />
      <EventsImagesWheel eventsArray={eventsArray} />
      {isLoggedIn && <PopularArtistsNear data={favoritedArtists} />}
    </div>
  );
};

export default HomePageComponent;
