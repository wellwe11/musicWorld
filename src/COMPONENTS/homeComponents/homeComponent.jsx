import React, { useEffect, useMemo, useRef, useState } from "react";
import classes from "./homeComponent.module.scss";
import BandText from "./pictureSliderTexts";

import starIcon from "./../upcomingEventsPage/playIcons/star.png";
import buttonClickArrow from "./images/arrow-right.png";
import infoIcon from "../defaultPage/navBar/images/info.png";

import CountryImageContainer from "./countryRepresenterComponent";
import MusicImportSection from "./muiscImportSection";
import FindAppSection from "./downloadAppSection";
import DisplayFamousArtistsComponent from "./displayPopularArtists";
import { useNavigate } from "react-router-dom";

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
    console.log("hi", e);
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

const InterestedButton = ({ isInterested, handleIsInterested, infoClick }) => {
  return (
    <div className={classes.interestedButtonsContainer}>
      <div
        className={classes.interestedButtonContainer}
        onClick={handleIsInterested}
      >
        {isInterested === true ? (
          <button className={classes.interestedButtonInterested}>
            <p>Interested</p>
            <img className={classes.interestedPlus} src={starIcon} alt="" />
          </button>
        ) : (
          <button className={classes.interestedButtonNotInterested}>
            <p>Interested</p>
            <img className={classes.interestedPlus} src={starIcon} alt="" />
          </button>
        )}
      </div>
      <button className={classes.interstedInfoButton} onClick={infoClick}>
        <img src={infoIcon} alt="" />
      </button>
    </div>
  );
};

const formatDate = (artist) => {
  if (artist?.event) {
    let artistDate = artist?.event.dates.start.localDate;
    const updated = new Date(artistDate);

    const dateOptions = { weekday: "short", month: "short", day: "numeric" };

    const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
      updated
    );

    return formattedDate;
  }
};

const ArtistProfile = ({
  artistData,
  interestedArtists,
  setInterestedArtists,
  setArtist,
}) => {
  const [isInterested, setIsInterested] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const navigate = useNavigate();

  const handleAddToInterested = () => {
    const newInterested = !isInterested;
    setIsInterested(newInterested);

    if (
      newInterested &&
      !interestedArtists?.some((e) => e?.artist.id === artistData?.artist.id)
    ) {
      setInterestedArtists((artists) => [...artists, artistData]);
    } else if (!newInterested && interestedArtists?.length > 0) {
      setInterestedArtists((artists) =>
        artists.filter((a) => a && a?.artist.id !== artistData?.artist.id)
      );
    }
  };

  useEffect(() => {
    // sets true on-load if exists in array
    if (
      interestedArtists?.some((e) => e?.artist.id === artistData?.artist.id)
    ) {
      setIsInterested(true);
    }

    if (
      !interestedArtists?.some((e) => e?.artist.id === artistData?.artist.id)
    ) {
      setIsInterested(false);
    }
  }, [interestedArtists]);

  useEffect(() => {
    if (
      interestedArtists?.some((e) => e?.artist.id === artistData?.artist.id)
    ) {
      setIsInterested(true);
    }
  }, []);

  useEffect(() => {
    const date = formatDate(artistData);
    setFormattedDate(date);
  }, [artistData]);

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  const logStuff = () => {
    const artistName = artistData?.artist.name.replace(/ /g, "+");

    handleNavigate(`./home/artistPage/id=${artistName}`);
    setArtist(artistName);
  };

  return (
    artistData && (
      <div className={classes.artistWrapper}>
        <h6>{formattedDate ? formattedDate : ""}</h6>
        <div className={classes.imageContainer}>
          <img src={artistData?.artist?.images[0]?.url} alt="" />
        </div>
        <div className={classes.artistTitle}>
          <h3>
            {artistData?.artist.name.slice(0, 19)}
            {artistData?.artist.name?.length > 19 && "..."}
          </h3>
          <InterestedButton
            isInterested={isInterested}
            handleIsInterested={handleAddToInterested}
            infoClick={logStuff}
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
  setArtist,
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
        setArtistContainerWidth(targetWidth / 230);
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
                    setArtist={setArtist}
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
  setArtist,
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
        className={`${
          loadElements > 2 ? classes.onLoadShow : classes.onLoadHidden
        }`}
      >
        <PopularArtistsNear
          artistData={eventsArray}
          interestedArtists={interestedArtists}
          setInterestedArtists={setInterestedArtists}
          title={"Artists close to you"}
          setArtist={setArtist}
        />
      </div>
      {interestedArtists.length > 0 && (
        <div
          className={`${classes.popularArtistsNearSection} ${
            loadElements > 3 ? classes.onLoadShow : classes.onLoadHidden
          }`}
        >
          <PopularArtistsNear
            artistData={interestedArtists}
            interestedArtists={interestedArtists}
            setInterestedArtists={setInterestedArtists}
            title={"Following artists"}
            setArtist={setArtist}
          />
        </div>
      )}
      <div
        className={loadElements > 4 ? classes.onLoadShow : classes.onLoadHidden}
      >
        {/* <DisplayFamousArtistsComponent eventsArray={eventsArray} /> */}
        <MusicImportSection />
        {/* <FindAppSection /> */}
      </div>
    </div>
  );
};

export default HomePageComponent;
