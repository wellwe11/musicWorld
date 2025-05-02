import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./homeComponent.module.scss";
import { findFittingImage } from "../../PAGES/functions/findFittingImage";
import BandText from "./pictureSliderTexts";

import buttonClickArrow from "./images/arrow-right.png";
import buttonClickPlus from "./images/plus.png";
import buttonClickClose from "../../COMPONENTS/defaultPage/searchInput/close.png";
import NavButton from "../defaultPage/navBar/navButton";

const EventsImagesWheel = ({ eventsArray }) => {
  const [displayEvents, setDisplayEvents] = useState([]);

  const [isHovering, setIsHovering] = useState(false);

  const [displayedImage, setDisplayedImage] = useState(0);

  useEffect(() => {
    if (!isHovering) {
      const timer = setTimeout(() => {
        setDisplayedImage((prev) => (prev < 5 ? prev + 1 : 0));
      }, 12500);
      return () => clearTimeout(timer);
    }
  }, [displayedImage, isHovering]);

  const amountOfEventsDisplay = useMemo(() => {
    return eventsArray.map((event, index) => {
      const eventsImages = event?.images.filter(
        (image) => image.ratio === "16_9" && image.height > 1000
      );
      return eventsImages;
    });
  }, [eventsArray]);

  // re-renders the home-component once
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

const InterestedButton = ({ isInterested, setIsInterested }) => {
  const changeIsInterested = () =>
    isInterested ? setIsInterested(false) : setIsInterested(true);

  return (
    <div
      className={classes.interestedButtonContainer}
      onClick={changeIsInterested}
    >
      {!isInterested ? (
        <NavButton externalClass={classes.interestedButtonNotInterested}>
          Interested
          <img
            className={classes.interestedPlus}
            src={buttonClickPlus}
            alt=""
          />
        </NavButton>
      ) : (
        <NavButton externalClass={classes.interestedButtonInterested}>
          Interested
          <img
            className={classes.interestedPlus}
            src={buttonClickClose}
            alt=""
          />
        </NavButton>
      )}
    </div>
  );
};

const ArtistProfile = ({ data, interestedArtists, setInterestedArtists }) => {
  const [isInterested, setIsInterested] = useState(null);

  useEffect(() => {
    if (isInterested && !interestedArtists?.some((e) => e === data)) {
      setInterestedArtists((artists) => [...artists, data]);
    }

    if (isInterested === false && interestedArtists?.length > 0) {
      setInterestedArtists((artists) =>
        artists.filter((artist) => artist !== data)
      );
    }
  }, [isInterested]);

  useEffect(() => {
    // sets true on-load if exists in array
    if (interestedArtists?.some((e) => e === data)) {
      setIsInterested(true);
    }

    if (!interestedArtists?.some((e) => e === data)) {
      setIsInterested(false);
    }
  }, [interestedArtists]);

  const artist = data?._embedded?.attractions?.[0];

  return (
    <div className={classes.artistWrapper}>
      {artist && (
        <>
          <div className={classes.imageContainer}>
            <img src={artist?.images[0]?.url} alt="" />
            <div className={classes.artistTitle}>
              <h4>{artist?.name}</h4>
            </div>
          </div>
          <InterestedButton
            isInterested={isInterested}
            setIsInterested={setIsInterested}
          />
        </>
      )}
    </div>
  );
};

const ArrowButton = ({ clickDirection, clickFn }) => {
  return (
    <button className={classes.arrowButton} onClick={clickFn}>
      <img
        src={buttonClickArrow}
        alt=""
        style={{ transform: clickDirection === "left" ? "rotate(180deg)" : "" }}
      />
    </button>
  );
};

const PopularArtistsNear = ({
  data,
  interestedArtists,
  setInterestedArtists,
}) => {
  const scrollRef = useRef();
  const [canLoadContent, setCanLoadContent] = useState(false);

  const scroller = (direction) => {
    if (direction === "right") {
      scrollRef.current.scrollBy({
        left: 500,
      });
    }

    if (direction === "left") {
      scrollRef.current.scrollBy({
        left: -500,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanLoadContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={classes.popularArtistsContainer}>
      <h2 className={classes.artistsNearTitle}>{"Artists near you..."}</h2>
      {canLoadContent && (
        <div className={classes.arrayAndButtons}>
          <ArrowButton
            clickDirection={"left"}
            clickFn={() => scroller("left")}
          />
          <div className={classes.popularArtistsWrapper} ref={scrollRef}>
            {[...Array(15)].map((_, index) => (
              <div key={index} className={classes.artistProfileMapContainer}>
                <ArtistProfile
                  interestedArtists={interestedArtists}
                  setInterestedArtists={setInterestedArtists}
                  data={data[index]}
                />
              </div>
            ))}
          </div>
          <ArrowButton
            clickDirection={"right"}
            clickFn={() => scroller("right")}
          />
        </div>
      )}
    </div>
  );
};

const HomePageComponent = ({ eventsArray }) => {
  let isLoggedIn = false;
  const [interestedArtists, setInterestedArtists] = useState([]);

  return (
    <div className={classes.homePageComponentContainer}>
      <EventsImagesWheel eventsArray={eventsArray} />
      <PopularArtistsNear
        interestedArtists={interestedArtists}
        setInterestedArtists={setInterestedArtists}
        data={eventsArray}
      />
      {interestedArtists.length > 0 && (
        <PopularArtistsNear
          data={interestedArtists}
          interestedArtists={interestedArtists}
          setInterestedArtists={setInterestedArtists}
        />
      )}
    </div>
  );
};

export default HomePageComponent;
