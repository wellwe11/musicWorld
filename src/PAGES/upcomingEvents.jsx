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

const UpcomingEventsPage = ({ city, eventsArray }) => {
  const { loading } = useContext(EventContext);
  const [currentPage, setCurrentPage] = useState(1);

  const [maxViewEvent, setMaxViewEVent] = useState(5);
  const [minViewEvent, setMinViewEvent] = useState(0);

  useEffect(() => {
    if (currentPage === 1) {
      setMinViewEvent(0);
      setMaxViewEVent(5);
    }

    if (currentPage > 1) {
      // displays events relevant to current page
      setMaxViewEVent(currentPage * 5 + currentPage - 1);
    }
  }, [currentPage]);

  useEffect(() => {
    setMinViewEvent(maxViewEvent - 5);
  }, [maxViewEvent]);

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
