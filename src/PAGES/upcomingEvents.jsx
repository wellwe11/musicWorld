import { useContext, useEffect, useState } from "react";
import Events from "../COMPONENTS/upcomingEventsPage/events";
import classes from "./defaultPage.module.scss";

import { EventContext } from "../App";

import squareStyleIcon from "./window-of-four-rounded-squares.png";
import listStyleIcon from "./list-text.png";

const PageToView = ({ eventsArray, currentPage, setCurrentPage }) => {
  const [maxPageReached, setMaxPagedReached] = useState("");
  const amountOfPages = Math.round(eventsArray?.length / 6);

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
      <p>{currentPage}</p>
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

const UpcomingEventsPage = ({ city, country }) => {
  const { events, loading } = useContext(EventContext);
  const [currentPage, setCurrentPage] = useState(1);

  const [maxViewEvent, setMaxViewEVent] = useState(5);
  const [minViewEvent, setMinViewEvent] = useState(0);

  // a new array containing filtered events to avoid duplicates
  const [eventsArray, setEventsArray] = useState([]);

  useEffect(() => {
    if (currentPage === 1) {
      setMinViewEvent(1);
      setMaxViewEVent(5);
    }

    if (currentPage > 1) {
      setMaxViewEVent(currentPage * 5);
    }
  }, [currentPage]);

  useEffect(() => {
    setMinViewEvent(maxViewEvent - 5);
  }, [maxViewEvent]);

  // filters the events so it doesnt display a large amount of same events.
  // in the coming days I will be storing their future dates as well, returning it to
  // the object, and allowing it to be displayed such as "startDate - endDate"(endDate being the final day of the same "days")
  // OR if possible, I will try to find final days of tour/event in the fetch
  const addEvents = () => {
    // local array to save component from reloading
    const updatedArray = [];

    // create a new set to store unique id's which is related to events. Same events store the same ID, thus avoiding many of the same events to be displayed on the page.
    const idSet = new Set();

    // events.events is the original fetch
    events?.events?.forEach((event) => {
      // add local variable for readable code
      const idToNotMatch = event?._embedded?.attractions?.[0]?.id;
      if (idToNotMatch && !idSet.has(idToNotMatch)) {
        idSet.add(idToNotMatch);
        updatedArray.push(event);
      }
    });

    if (updatedArray.length > 0) {
      // sort items by date
      const sortedUpdatedArray = updatedArray.sort((a, b) => {
        let numOne = a?.dates?.start?.localDate
          .toString("")
          .replaceAll("-", "");
        let numTwo = b?.dates?.start?.localDate
          .toString("")
          .replaceAll("-", "");

        return +numOne - +numTwo;
      });

      // finally push array to components local state
      setEventsArray(sortedUpdatedArray);
    }
  };

  // calls the filter whenever the original fetch is updated (I.e. you click "next page" to view more evnets)
  useEffect(() => {
    addEvents();
  }, [events]);

  return (
    <div className={classes.UpcomingEventsPage}>
      {/* Two icons which I will be using later */}
      {/* <div className={classes.displayTypeIconsContainer}>
        <img src={listStyleIcon} alt="" />
        <img src={squareStyleIcon} alt="" />
        </div> */}
      <div className={classes.pageEventsWrapper}>
        <h1 className={classes.locationTitle}>
          Viewing events in{" "}
          {city.charAt(0).toUpperCase() + city.slice(1) ||
            eventsArray?.[0]?._embedded?.venues?.[0]?.country?.name ||
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
