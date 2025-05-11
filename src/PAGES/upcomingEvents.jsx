import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Events from "../COMPONENTS/upcomingEventsPage/events";
import classes from "./defaultPage.module.scss";

import { EventContext, fetchDataTicketMaster } from "../App";

import squareStyleIcon from "./window-of-four-rounded-squares.png";
import listStyleIcon from "./list-text.png";
import { PopularArtistsNear } from "../COMPONENTS/homeComponents/homeComponent";
import LoadingSvg from "../COMPONENTS/artistPageComponents/media/loadingSvg";

const PageToView = ({ eventsArray, currentPage, setCurrentPage }) => {
  const [maxPageReached, setMaxPagedReached] = useState("");
  const amountOfPages = Math.round(eventsArray?.length / 12);

  useEffect(() => {
    setCurrentPage(1);
  }, [eventsArray]);

  const handleCurrentPage = (type) => {
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
        onClick={() => setCurrentPage(1)}
        style={{
          color: currentPage === 1 ? "gray" : "",
          position: "absolute",
          left: "0",
          marginLeft: "-25px",
        }}
      >
        {skipToFirst}
      </button>
      <button
        onClick={() => handleCurrentPage("-")}
        style={{
          color: maxPageReached === "-" ? "gray" : "",
        }}
      >
        {previous}
      </button>
      <p>
        {currentPage} of {amountOfPages}
      </p>
      <button
        onClick={() => handleCurrentPage("+")}
        style={{
          color: maxPageReached === "+" ? "gray" : "",
        }}
      >
        {next}
      </button>
    </div>
  );
};

const UpcomingEventsPage = ({
  city,
  country,
  dateFrom,
  eventsArray,
  interestedArtists,
  setInterestedArtists,
  loading,
}) => {
  // const { loading } = useContext(EventContext);
  const [currentPage, setCurrentPage] = useState(1);

  const [maxViewEvent, setMaxViewEVent] = useState(11);
  const [minViewEvent, setMinViewEvent] = useState(0);

  const [eventsThisDate, setEventsThisDate] = useState([]);
  const [eventsThisDateName, setEventsThisDateName] = useState("");
  const [eventsNotToday, setEventsNotToday] = useState([]);

  const [events, setEvents] = useState([]);

  const findArtistsNear = () => {
    const localArray = [];

    eventsArray?.filter((event) => {
      const artistsObject = event.artist;

      if (interestedArtists.some((b) => artistsObject.id === b.id)) {
        localArray.push(artistsObject);
      }
    });

    return setEvents(localArray);
  };

  useEffect(() => {
    // if to protect from odd renders after searching for artist
    if (eventsArray?.length > 1) {
      findArtistsNear();
    }
  }, [eventsArray, interestedArtists]);

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

  console.log(events);

  return (
    <div className={classes.UpcomingEventsPage}>
      {/* Two icons which I will be using later */}
      {/* <div className={classes.displayTypeIconsContainer}>
        <img src={listStyleIcon} alt="" />
        <img src={squareStyleIcon} alt="" />
        </div> */}
      {events && eventsNotToday.length > 0 ? (
        <>
          {events.length > 0 && currentPage === 1 && (
            <div>
              <PopularArtistsNear
                artistData={events}
                interestedArtists={interestedArtists}
                setInterestedArtists={setInterestedArtists}
                title={"Following upcoming artists..."}
                type={"following"}
              />
            </div>
          )}
          <div className={classes.eventsToday}>
            {eventsThisDate.length > 0 && currentPage === 1 && (
              <div className={classes.pageEventsWrapper}>
                <h1 className={classes.locationTitle}>
                  {dateFrom ? "Events " + eventsThisDateName : "Events today"}
                </h1>
                {eventsThisDate && eventsThisDate.length > 0 ? (
                  <Events
                    eventsArray={eventsThisDate}
                    loading={loading}
                    minViewEvent={0}
                    maxViewEVent={eventsThisDate.length}
                    interestedArtists={interestedArtists}
                    setInterestedArtists={setInterestedArtists}
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
              {city.charAt(0).toUpperCase() + city.slice(1) ||
                eventsArray?.[0]?.event?._embedded?.venues?.[0]?.country
                  ?.name ||
                "Loading location..."}
            </h1>
            <Events
              eventsArray={eventsNotToday}
              loading={loading}
              minViewEvent={minViewEvent}
              maxViewEVent={maxViewEvent}
              interestedArtists={interestedArtists}
              setInterestedArtists={setInterestedArtists}
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
      )}
    </div>
  );
};

export default UpcomingEventsPage;
