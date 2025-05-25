import React, { useEffect, useState } from "react";
import Events from "../COMPONENTS/upcomingEventsPage/events";
import classes from "./defaultPage.module.scss";

import { PopularArtistsNear } from "../COMPONENTS/homeComponents/homeComponent";
import LoadingSvg from "../COMPONENTS/artistPageComponents/media/loadingSvg";

const PageToView = ({ eventsArray, currentPage, setCurrentPage }) => {
  const [maxPageReached, setMaxPagedReached] = useState("");
  const amountOfPages = Math.round(eventsArray?.length / 12);

  useEffect(() => {
    setCurrentPage(1);
  }, [eventsArray]);

  const handleCurrentPage = (type) => {
    window.scrollTo({ top: 0, behavior: "auto" });

    switch (type) {
      case "+":
        if (currentPage < amountOfPages)
          setCurrentPage((prevPage) => prevPage + 1);
        break;
      case "-":
        if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
        break;
      default:
        return console.log("handleCurrentPage isn't working");
    }
  };

  useEffect(() => {
    if (currentPage === amountOfPages) setMaxPagedReached("+");

    if (currentPage === 1) setMaxPagedReached("-");

    if (currentPage < amountOfPages && currentPage > 1) setMaxPagedReached("");
  }, [currentPage]);

  const next = ">";
  const previous = "<";
  const skipToFirst = "<<";

  return (
    <div className={classes.pageToView}>
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "auto" });
          setCurrentPage(1);
        }}
        style={{
          color: currentPage === 1 ? "gray" : "",
          position: "absolute",
          left: "0",
          marginLeft: "-35px",
        }}
      >
        <h2>{skipToFirst}</h2>
      </button>
      <button
        onClick={() => handleCurrentPage("-")}
        style={{
          color: maxPageReached === "-" ? "gray" : "",
        }}
      >
        <h2>{previous}</h2>
      </button>
      <h5>
        {currentPage} of {amountOfPages}
      </h5>
      <button
        onClick={() => handleCurrentPage("+")}
        style={{
          color: maxPageReached === "+" ? "gray" : "",
        }}
      >
        <h2>{next}</h2>
      </button>
    </div>
  );
};

const UpcomingEventsPage = React.memo(function UpcomingEventsPage({
  city,
  country,
  dateFrom,
  eventsArray,
  interestedArtists,
  setInterestedArtists,
  loading,
  setArtist,
}) {
  console.log(eventsArray);
  // const { loading } = useContext(EventContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [noEvents, setNoEvents] = useState(false);

  const [maxViewEvent, setMaxViewEVent] = useState(11);
  const [minViewEvent, setMinViewEvent] = useState(0);

  const [eventsThisDate, setEventsThisDate] = useState([]);
  const [eventsThisDateName, setEventsThisDateName] = useState("");
  const [eventsNotToday, setEventsNotToday] = useState([]);

  // a local state to track which event has clicked it's play button. Helps avoid all children
  // click play once you interact with an element
  const [clickedEvent, setClickedEvent] = useState(null);

  // this is a state used inside of each event which is passed as a prop.
  // It forces a single-play option. Otherwise, if a user wants to click several
  // events to hear music, it'll play them all at the same time.
  // Having this state in parent, you avoid this as it can only be true
  // for one child
  const [imageClicked, setImageClicked] = useState(false);

  const [events, setEvents] = useState([]);

  const findArtistsNear = () => {
    const localArray = eventsArray?.filter((event) =>
      interestedArtists.some((b) => event?.artist.id === b?.artist.id)
    );

    return setEvents(localArray);
  };

  useEffect(() => {
    // if to protect from odd renders after searching for artist
    const timer = setTimeout(() => {
      if (eventsArray?.length > 0) {
        setNoEvents(false);
        return findArtistsNear();
      } else {
        setNoEvents(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [eventsArray, interestedArtists]);

  const NoArtistsFound = () => {
    return (
      <div>
        <h1>{"No events :("}</h1>
      </div>
    );
  };

  useEffect(() => {
    if (currentPage === 1) {
      setMinViewEvent(0);
      setMaxViewEVent(11);
    }

    if (currentPage > 1) {
      // displays events relevant to current page
      setMaxViewEVent(currentPage * 11 + currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    setMinViewEvent(maxViewEvent - 11);
  }, [maxViewEvent]);

  const findEventsToday = () => {
    let date;

    if (!dateFrom) {
      date = new Date();
    }

    if (dateFrom) {
      date = new Date(dateFrom);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setEventsThisDateName(formattedDate);
    }

    const formattedDate = date.toISOString().split("T")[0];

    const filterForToday = eventsArray?.filter(
      (event) => formattedDate === event.event.dates.start.localDate
    );

    setEventsThisDate(filterForToday);
  };

  const filterAwayEventsTodayFromNormalEvents = () => {
    const filterNormalEvents = eventsArray?.filter(
      (event) => !eventsThisDate.some((e) => e === event)
    );

    setEventsNotToday(filterNormalEvents);
  };

  useEffect(() => {
    if (eventsArray) {
      findEventsToday();
    }
  }, [eventsArray]);

  useEffect(() => {
    if (eventsThisDate) {
      filterAwayEventsTodayFromNormalEvents();
    }
  }, [eventsThisDate]);

  return (
    <div className={classes.UpcomingEventsPage}>
      {/* Two icons which I will be using later */}
      {/* <div className={classes.displayTypeIconsContainer}>
        <img src={listStyleIcon} alt="" />
        <img src={squareStyleIcon} alt="" />
      </div> */}
      {!noEvents ? (
        eventsArray?.length > 0 ? (
          <>
            {events.length > 0 && currentPage === 1 && (
              <div>
                <PopularArtistsNear
                  artistData={events}
                  interestedArtists={interestedArtists}
                  setInterestedArtists={setInterestedArtists}
                  title={"Following upcoming artists..."}
                  setArtist={setArtist}
                />
              </div>
            )}
            <div className={classes.eventsToday}>
              {eventsThisDate?.length > 0 && currentPage === 1 && (
                <div className={classes.pageEventsWrapper}>
                  <h1 className={classes.locationTitle}>
                    {dateFrom
                      ? "Events " + eventsThisDateName.replace(/_/g, " ")
                      : "Events today"}
                  </h1>
                  {eventsThisDate && eventsThisDate.length > 0 ? (
                    <Events
                      artistData={events}
                      eventsArray={eventsThisDate}
                      loading={loading}
                      minViewEvent={0}
                      maxViewEvent={eventsThisDate.length}
                      interestedArtists={interestedArtists}
                      setInterestedArtists={setInterestedArtists}
                      clickedEvent={clickedEvent}
                      setClickedEvent={setClickedEvent}
                      imageClicked={imageClicked}
                      setImageClicked={setImageClicked}
                      setArtist={setArtist}
                    />
                  ) : (
                    <div className={classes.loadingSvgContainer}>
                      <LoadingSvg />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={classes.pageEventsWrapper}>
              <h1 className={classes.locationTitle}>
                Viewing events in{" "}
                {city.charAt(0).toUpperCase() +
                  city.slice(1).replace(/_/g, " ") ||
                  eventsArray?.[0]?.event?._embedded?.venues?.[0]?.country?.name.replace(
                    /_/g,
                    " "
                  ) ||
                  "Loading location..."}
              </h1>
              <Events
                artistData={events}
                eventsArray={eventsNotToday}
                loading={loading}
                minViewEvent={minViewEvent}
                maxViewEvent={maxViewEvent}
                interestedArtists={interestedArtists}
                setInterestedArtists={setInterestedArtists}
                clickedEvent={clickedEvent}
                setClickedEvent={setClickedEvent}
                imageClicked={imageClicked}
                setImageClicked={setImageClicked}
              />
            </div>
            <PageToView
              eventsArray={eventsArray}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <div className={classes.loadingSvgContainer}>
            <LoadingSvg />
          </div>
        )
      ) : (
        <NoArtistsFound />
      )}
    </div>
  );
});

export default UpcomingEventsPage;
