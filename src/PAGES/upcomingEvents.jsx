import { useContext, useEffect, useState } from "react";
import Events from "../COMPONENTS/upcomingEventsPage/events";
import classes from "./defaultPage.module.scss";

import { EventContext } from "../App";

const PageToView = ({ currentPage, setCurrentPage }) => {
  const { events } = useContext(EventContext);
  const [maxPageReached, setMaxPagedReached] = useState("");
  const amountOfPages = Math.round(events?.events?.length / 6);

  const handleCurrentPage = (type) => {
    switch (type) {
      case "+":
        if (currentPage < amountOfPages) {
          return setCurrentPage((prevPage) => prevPage + 1);
        }

        break;
      case "-":
        if (currentPage > 1) return setCurrentPage((prevPage) => prevPage - 1);

        break;
      default:
        return console.log("handleCurrentPage isn't working");
    }
  };

  useEffect(() => {
    console.log(currentPage);
    if (currentPage === 1) setMaxPagedReached("-");

    if (currentPage === amountOfPages) setMaxPagedReached("+");

    if (currentPage < amountOfPages && currentPage > 1) setMaxPagedReached("");
  }, [currentPage]);

  const next = ">";
  const previous = "<";

  return (
    <div className={classes.pageToView}>
      <button
        onClick={() => handleCurrentPage("-")}
        style={{ color: maxPageReached === "-" ? "gray" : "" }}
      >
        {previous}
      </button>
      <p>{currentPage}</p>
      <button
        onClick={() => handleCurrentPage("+")}
        style={{ color: maxPageReached === "+" ? "gray" : "" }}
      >
        {next}
      </button>
    </div>
  );
};

const UpcomingEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [maxViewEvent, setMaxViewEVent] = useState(5);
  const [minViewEvent, setMinViewEvent] = useState(0);

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

  return (
    <div className={classes.UpcomingEventsPage}>
      <Events minViewEvent={minViewEvent} maxViewEVent={maxViewEvent} />
      <PageToView currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default UpcomingEventsPage;
