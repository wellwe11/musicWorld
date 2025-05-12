import React, { useEffect, useMemo, useRef, useState } from "react";
import classes from "./homeComponent.module.scss";
import BandText from "./pictureSliderTexts";

import starIcon from "./../upcomingEventsPage/playIcons/star.png";
import buttonClickArrow from "./images/arrow-right.png";

import CountryImageContainer from "./countryRepresenterComponent";
import MusicImportSection from "./muiscImportSection";
import FindAppSection from "./downloadAppSection";

const EventsImagesWheel = ({
  eventsArray,
  displayedImage,
  setDisplayedImage,
  oneEventPerDay,
  setOneEventPerDay,
}) => {
  const [displayEvents, setDisplayEvents] = useState([]);

  const [isHovering, setIsHovering] = useState(false);

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
      const iDay = new Date(iDate).getDate();

      if (!localArr.some((a) => a.date === iDate)) {
        localArr.push({
          date: iDate,
          event: eventsArray[i]?.event,
          day: iDay,
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
          {displayEvents.slice(0, 6).map((event, index) => {
            if (index === displayedImage) {
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

const InterestedButton = ({ isInterested, handleIsInterested }) => {
  return (
    <div
      className={classes.interestedButtonContainer}
      onClick={handleIsInterested}
    >
      {isInterested === true ? (
        <button className={classes.interestedButtonInterested}>
          Interested
          <img className={classes.interestedPlus} src={starIcon} alt="" />
        </button>
      ) : (
        <button className={classes.interestedButtonNotInterested}>
          Interested
          <img className={classes.interestedPlus} src={starIcon} alt="" />
        </button>
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
  const [isInterested, setIsInterested] = useState(false);
  let artist;

  if (type === "near") {
    artist = artistData.artist;
  }

  if (type === "following") {
    artist = artistData;
  }

  const handleAddToInterested = () => {
    const newInterested = !isInterested;
    setIsInterested(newInterested);

    if (
      newInterested &&
      !interestedArtists?.some((e) => e?.id === artist?.id)
    ) {
      setInterestedArtists((artists) => [...artists, artist]);
    } else if (!newInterested && interestedArtists?.length > 0) {
      setInterestedArtists((artists) =>
        artists.filter((a) => a && a?.id !== artist?.id)
      );
    }
  };

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
    artistData && (
      <div className={classes.artistWrapper}>
        <div className={classes.imageContainer}>
          <img src={artist?.images[0]?.url} alt="" />
        </div>
        <div className={classes.artistTitle}>
          <h3>{artist?.name}</h3>
          <InterestedButton
            isInterested={isInterested}
            handleIsInterested={handleAddToInterested}
          />
        </div>
      </div>
    )
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

export const PopularArtistsNear = React.memo(function PopularArtistsNear({
  artistData,
  interestedArtists,
  setInterestedArtists,
  title,
  type,
}) {
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

        <div
          ref={followingArtistsContainerRef}
          style={{ scrollBehavior: "smooth" }}
        >
          <div className={classes.popularArtistsWrapper} ref={scrollRef}>
            {artistData
              .slice(0, artistData.length > 15 ? 15 : artistData.length)
              .map((artistObj, index) => (
                <div
                  key={artistObj?.artist?.id || artistObj?.id}
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
});

const HomePageComponent = ({
  eventsArray,
  interestedArtists,
  setInterestedArtists,
  country,
  setDateFrom,
  setDateTill,
}) => {
  let isLoggedIn = false;

  const [displayedImage, setDisplayedImage] = useState(0);

  const [loadElements, setLoadElements] = useState(0);

  const [oneEventPerDay, setOneEventPerDay] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadElements < 5) {
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
          eventsArray={oneEventPerDay.slice(0, 6)}
          displayedImage={displayedImage}
          setDisplayedImage={setDisplayedImage}
          setDateFrom={setDateFrom}
          setDateTill={setDateTill}
        />
      </div>

      <div
        className={loadElements > 1 ? classes.onLoadShow : classes.onLoadHidden}
      >
        <EventsImagesWheel
          eventsArray={eventsArray}
          displayedImage={displayedImage}
          setDisplayedImage={setDisplayedImage}
          oneEventPerDay={oneEventPerDay}
          setOneEventPerDay={setOneEventPerDay}
        />
      </div>
      <div
        className={loadElements > 2 ? classes.onLoadShow : classes.onLoadHidden}
      >
        <div>
          <PopularArtistsNear
            artistData={eventsArray}
            interestedArtists={interestedArtists}
            setInterestedArtists={setInterestedArtists}
            title={"Artists close to you"}
            type={"near"}
          />
        </div>
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
      <div
        className={loadElements > 4 ? classes.onLoadShow : classes.onLoadHidden}
      >
        <MusicImportSection />
        <FindAppSection />
      </div>
    </div>
  );
};

export default HomePageComponent;
