import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Events from "../COMPONENTS/upcomingEventsPage/events";
import classes from "./defaultPage.module.scss";

import { EventContext, fetchDataTicketMaster } from "../App";

import squareStyleIcon from "./window-of-four-rounded-squares.png";
import listStyleIcon from "./list-text.png";
import { PopularArtistsNear } from "../COMPONENTS/homeComponents/homeComponent";

const PageToView = ({ eventsArray, currentPage, setCurrentPage }) => {
  const [maxPageReached, setMaxPagedReached] = useState("");
  const amountOfPages = Math.round(eventsArray?.length / 12);

  useEffect(() => {
    setCurrentPage(1);
  }, [eventsArray]);

  const handleCurrentPage = (type) => {
    switch (type) {
      case "+":
        if (currentPage <= amountOfPages)
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
    if (currentPage === amountOfPages + 1) setMaxPagedReached("+");

    if (currentPage === 1) setMaxPagedReached("-");

    if (currentPage < amountOfPages && currentPage > 1) setMaxPagedReached("");
  }, [currentPage]);

  const next = ">";
  const previous = "<";

  return (
    <div className={classes.pageToView}>
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
  eventsArray,
  interestedArtists,
  setInterestedArtists,
}) => {
  const { loading } = useContext(EventContext);
  const [currentPage, setCurrentPage] = useState(1);

  const [maxViewEvent, setMaxViewEVent] = useState(11);
  const [minViewEvent, setMinViewEvent] = useState(0);

  const [events, setEvents] = useState([]);

  const findArtistsNear = () => {
    const localArray = [];

    eventsArray?.filter((event) => {
      const artistsObject = event.artist;

      if (interestedArtists.some((b) => artistsObject.id === b.id)) {
        console.log(event);
        localArray.push(artistsObject);
      }
    });

    console.log(localArray);
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

  return (
    <div className={classes.UpcomingEventsPage}>
      {/* Two icons which I will be using later */}
      {/* <div className={classes.displayTypeIconsContainer}>
        <img src={listStyleIcon} alt="" />
        <img src={squareStyleIcon} alt="" />
        </div> */}
      {events.length > 0 && (
        <div>
          <PopularArtistsNear
            artistData={events}
            interestedArtists={interestedArtists}
            setInterestedArtists={setInterestedArtists}
            title={"Following artists"}
            type={"following"}
          />
        </div>
      )}
      <div className={classes.pageEventsWrapper}>
        <h1 className={classes.locationTitle}>
          Viewing events in{" "}
          {city.charAt(0).toUpperCase() + city.slice(1) ||
            eventsArray?.[0]?.event?._embedded?.venues?.[0]?.country?.name ||
            "Loading location..."}
        </h1>
        <Events
          eventsArray={eventsArray}
          loading={loading}
          minViewEvent={minViewEvent}
          maxViewEVent={maxViewEvent}
        />
      </div>
      <PageToView
        eventsArray={eventsArray}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default UpcomingEventsPage;
