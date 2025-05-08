import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from "./homeComponent.module.scss";
import BandText from "./pictureSliderTexts";

import buttonClickArrow from "./images/arrow-right.png";
import buttonClickPlus from "./images/plus.png";
import buttonClickClose from "../../COMPONENTS/defaultPage/searchInput/close.png";
import NavButton from "../defaultPage/navBar/navButton";
import { fetchDataTicketMaster } from "../../App";
import CountryImageContainer from "./countryRepresenterComponent";

const EventsImagesWheel = ({
  eventsArray,
  displayedImage,
  setDisplayedImage,
}) => {
  const [displayEvents, setDisplayEvents] = useState([]);

  const [isHovering, setIsHovering] = useState(false);
  const [oneEventPerDay, setOneEventPerDay] = useState([]);

  useEffect(() => {
    if (!isHovering) {
      const timer = setTimeout(() => {
        setDisplayedImage((prev) => (prev < 5 ? prev + 1 : 0));
      }, 12500);
      return () => clearTimeout(timer);
    }
  }, [displayedImage, isHovering]);

  const filterEventsPerDay = () => {
    const localArr = [];

    for (let i = 0; i < eventsArray?.length; i++) {
      const iDate = eventsArray[i]?.event.dates.start.localDate;

      if (!localArr.some((a) => a.date === iDate)) {
        localArr.push({
          date: iDate,
          event: eventsArray[i]?.event,
        });
      }
    }

    setOneEventPerDay(localArr);
  };

  useEffect(() => {
    if (eventsArray) {
      filterEventsPerDay();
    }
  }, [eventsArray]);

  const amountOfEventsDisplay = useMemo(() => {
    if (!oneEventPerDay || oneEventPerDay.length <= 6) return [];

    return oneEventPerDay
      .slice(0, 8)
      .map((event) =>
        event?.event.images.filter(
          (image) => image.ratio === "16_9" && image.height > 1000
        )
      );
  }, [oneEventPerDay]);

  // re-renders the home-component once
  useEffect(() => {
    if (amountOfEventsDisplay) {
      setDisplayEvents(amountOfEventsDisplay);
    }
  }, [oneEventPerDay]);

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
    <>
      {displayEvents && (
        <div
          className={classes.pictureSliderContainer}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {displayEvents.map((event, index) => {
            if (index < 6 && index === displayedImage) {
              return (
                <div
                  key={index}
                  className={`${classes.pictureSliderImage} ${
                    index === displayedImage ? classes.displayedImage : ""
                  }`}
                >
                  <div
                    className={classes.imageContainer}
                    onClick={() => logStuff(event)}
                  >
                    <button
                      className={classes.pictureSliderButton}
                      onClick={displayedImageMinus}
                    >
                      <img src={buttonClickArrow} alt="" />
                    </button>

                    <img
                      className={classes.visibleImage}
                      src={event?.[0]?.url}
                      alt=""
                    />

                    <BandText
                      data={oneEventPerDay[index].event}
                      index={index}
                    />

                    <button
                      className={classes.pictureSliderButton}
                      onClick={displayedImageAdd}
                    >
                      <img src={buttonClickArrow} alt="" />
                    </button>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}

          <div className={classes.activeImageButtons}>
            {[...Array(6)].map((_, index) => (
              <button
                key={index}
                className={`${classes.buttonDot} ${
                  index === displayedImage ? classes.isFocused : ""
                }`}
                onClick={() => setDisplayedImage(index)}
              />
            ))}
          </div>
        </div>
      )}
    </>
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
    const trackSize = () => {
      if (followingArtistsContainerRef.current) {
        let targetWidth = followingArtistsContainerRef.current.offsetWidth;
        setArtistContainerWidth(targetWidth / 200);
      }
    };

    const loadTimer = setTimeout(trackSize, 2100);

    window.addEventListener("resize", trackSize);

    return () => {
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

      <div className={classes.arrayAndButtons}>
        <div
          className={`${
            showScrollButtons ? classes.opacityOn : classes.opacityOff
          }`}
        >
          <ArrowButton
            clickDirection={"left"}
            clickFn={() => scroller("left")}
          />
        </div>

        <div ref={followingArtistsContainerRef}>
          <div className={classes.popularArtistsWrapper} ref={scrollRef}>
            {artistData
              .slice(0, artistData.length > 15 ? 15 : artistData.length)
              .map((_, index) => (
                <div key={index} className={classes.artistProfileMapContainer}>
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
        <div
          className={`${
            showScrollButtons ? classes.opacityOn : classes.opacityOff
          }`}
        >
          <ArrowButton
            clickDirection={"right"}
            clickFn={() => scroller("right")}
          />
        </div>
      </div>
    </div>
  );
};

const HomePageComponent = ({
  eventsArray,
  interestedArtists,
  setInterestedArtists,
  country,
  setDateFrom,
}) => {
  let isLoggedIn = false;

  const [displayedImage, setDisplayedImage] = useState(0);

  const [loadElements, setLoadElements] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadElements < 4) {
        setLoadElements((prev) => prev + 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [loadElements]);

  return (
    <div className={classes.homePageComponentContainer}>
      <div
        className={loadElements > 0 ? classes.onLoadShow : classes.onLoadHidden}
      >
        <CountryImageContainer
          country={country}
          eventsArray={eventsArray}
          displayedImage={displayedImage}
          setDisplayedImage={setDisplayedImage}
          setDateFrom={setDateFrom}
        />
      </div>

      <div
        className={loadElements > 1 ? classes.onLoadShow : classes.onLoadHidden}
      >
        <EventsImagesWheel
          eventsArray={eventsArray}
          displayedImage={displayedImage}
          setDisplayedImage={setDisplayedImage}
        />
      </div>
      <div
        className={loadElements > 2 ? classes.onLoadShow : classes.onLoadHidden}
      >
        <PopularArtistsNear
          artistData={eventsArray}
          interestedArtists={interestedArtists}
          setInterestedArtists={setInterestedArtists}
          title={"Artists close to you"}
          type={"near"}
        />
      </div>
      {interestedArtists.length > 0 && (
        <div
          className={
            loadElements > 3 ? classes.onLoadShow : classes.onLoadHidden
          }
        >
          <PopularArtistsNear
            artistData={interestedArtists}
            interestedArtists={interestedArtists}
            setInterestedArtists={setInterestedArtists}
            title={"Following artists"}
            type={"following"}
          />
        </div>
      )}
    </div>
  );
};

export default HomePageComponent;
