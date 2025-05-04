import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from "./homeComponent.module.scss";
import BandText from "./pictureSliderTexts";

import buttonClickArrow from "./images/arrow-right.png";
import buttonClickPlus from "./images/plus.png";
import buttonClickClose from "../../COMPONENTS/defaultPage/searchInput/close.png";
import NavButton from "../defaultPage/navBar/navButton";
import { fetchDataTicketMaster } from "../../App";

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
    if (!eventsArray || eventsArray.length <= 6) return [];

    return eventsArray
      .slice(0, 8)
      .map((event) =>
        event?.artist.images.filter(
          (image) => image.ratio === "16_9" && image.height > 1000
        )
      );
  }, [eventsArray]);

  // re-renders the home-component once
  useEffect(() => {
    if (amountOfEventsDisplay) {
      setDisplayEvents(amountOfEventsDisplay);
    }
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

                  <BandText data={eventsArray[index].event} index={index} />
                </div>
                <button onClick={displayedImageAdd}>Next</button>
              </div>
            )
        )}
    </div>
  );
};

const InterestedButton = ({ isInterested, setIsInterested }) => {
  const changeIsInterested = () => {
    return isInterested ? setIsInterested(false) : setIsInterested(true);
  };

  return (
    <div
      className={classes.interestedButtonContainer}
      onClick={changeIsInterested}
    >
      {isInterested === true ? (
        <NavButton externalClass={classes.interestedButtonInterested}>
          Interested
          <img
            className={classes.interestedPlus}
            src={buttonClickClose}
            alt=""
          />
        </NavButton>
      ) : (
        <NavButton externalClass={classes.interestedButtonNotInterested}>
          Interested
          <img
            className={classes.interestedPlus}
            src={buttonClickPlus}
            alt=""
          />
        </NavButton>
      )}
    </div>
  );
};

const ArtistProfile = ({
  artistData,
  interestedArtists,
  setInterestedArtists,
  type,
}) => {
  const [isInterested, setIsInterested] = useState(null);
  let artist;

  if (type === "near") {
    artist = artistData.artist;
  }

  if (type === "following") {
    artist = artistData;
  }

  useEffect(() => {
    if (isInterested && !interestedArtists?.some((e) => e?.id === artist?.id)) {
      setInterestedArtists((artists) => [...artists, artist]);
    }

    if (isInterested === false && interestedArtists?.length > 0) {
      setInterestedArtists((artists) =>
        artists.filter((a) => a?.id !== artist?.id)
      );
    }
  }, [isInterested]);

  useEffect(() => {
    // sets true on-load if exists in array
    if (interestedArtists?.some((e) => e?.id === artist?.id)) {
      setIsInterested(true);
    }

    if (!interestedArtists?.some((e) => e?.id === artist?.id)) {
      setIsInterested(false);
    }
  }, [interestedArtists]);

  useEffect(() => {
    if (interestedArtists?.some((e) => e?.id === artist?.id)) {
      setIsInterested(true);
    }
  }, []);

  return (
    <div className={classes.artistWrapper}>
      {artistData && (
        <>
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

export const PopularArtistsNear = ({
  artistData,
  interestedArtists,
  setInterestedArtists,
  title,
  type,
}) => {
  const scrollRef = useRef();
  const [canLoadContent, setCanLoadContent] = useState(false);

  const followingArtistsContainerRef = useRef(null);
  const [artistContainerWidth, setArtistContainerWidth] = useState(null);
  const [showScrollButtons, setShowScrollButtons] = useState(true);

  const trackSizeAndDisplayButtons = () => {
    if (artistData) {
      if (artistData.length >= artistContainerWidth) {
        setShowScrollButtons(true);
      }

      if (artistData.length <= artistContainerWidth) {
        setShowScrollButtons(false);
      }
    }
  };

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

    const trackSize = () => {
      if (followingArtistsContainerRef.current) {
        let targetWidth = followingArtistsContainerRef.current.offsetWidth;
        setArtistContainerWidth(targetWidth / 200);
      }
    };

    const loadTimer = setTimeout(trackSize, 2100);

    window.addEventListener("resize", trackSize);

    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
      window.removeEventListener("resize", trackSize);
    };
  }, []);

  useEffect(() => {
    trackSizeAndDisplayButtons();
  }, [artistContainerWidth, artistData]);

  return (
    <div className={classes.popularArtistsContainer}>
      <h2 className={classes.artistsNearTitle}>{title}</h2>
      {canLoadContent && (
        <div className={classes.arrayAndButtons}>
          {showScrollButtons && (
            <ArrowButton
              clickDirection={"left"}
              clickFn={() => scroller("left")}
            />
          )}
          <div ref={followingArtistsContainerRef}>
            <div className={classes.popularArtistsWrapper} ref={scrollRef}>
              {artistData
                .slice(0, artistData.length > 15 ? 15 : artistData.length)
                .map((_, index) => (
                  <div
                    key={index}
                    className={classes.artistProfileMapContainer}
                  >
                    <ArtistProfile
                      interestedArtists={interestedArtists}
                      setInterestedArtists={setInterestedArtists}
                      artistData={artistData[index]}
                      type={type}
                    />
                  </div>
                ))}
            </div>
          </div>
          {showScrollButtons && (
            <ArrowButton
              clickDirection={"right"}
              clickFn={() => scroller("right")}
            />
          )}
        </div>
      )}
    </div>
  );
};

const HomePageComponent = ({
  eventsArray,
  interestedArtists,
  setInterestedArtists,
}) => {
  let isLoggedIn = false;

  return (
    <div className={classes.homePageComponentContainer}>
      <EventsImagesWheel eventsArray={eventsArray} />
      <PopularArtistsNear
        artistData={eventsArray}
        interestedArtists={interestedArtists}
        setInterestedArtists={setInterestedArtists}
        title={"Artists near you..."}
        type={"near"}
      />
      {interestedArtists.length > 0 && (
        <PopularArtistsNear
          artistData={interestedArtists}
          interestedArtists={interestedArtists}
          setInterestedArtists={setInterestedArtists}
          title={"Following artists"}
          type={"following"}
        />
      )}
    </div>
  );
};

export default HomePageComponent;
