import { useEffect, useState } from "react";
import Events from "../COMPONENTS/upcomingEventsPage/events";
import classes from "./defaultPage.module.scss";

const PageToView = ({ currentPage, setCurrentPage }) => {
  const handleCurrentPage = (type) => {
    switch (type) {
      case "+":
        return setCurrentPage((prevPage) => prevPage + 1);
      case "-":
        if (currentPage > 1) return setCurrentPage((prevPage) => prevPage - 1);
        break;
      default:
        return console.log("handleCurrentPage isn't working");
    }
  };

  const next = ">";
  const previous = "<";

  return (
    <div className={classes.pageToView}>
      <button onClick={() => handleCurrentPage("-")}>{previous}</button>
      <p>{currentPage}</p>
      <button onClick={() => handleCurrentPage("+")}>{next}</button>
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
