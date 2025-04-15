import { useContext, useEffect, useState } from "react";
import Events from "../COMPONENTS/upcomingEventsPage/events";

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

  return (
    <div>
      <button onClick={() => handleCurrentPage("+")}>Next</button>
      <p>{currentPage}</p>
      <p>{currentPage + 1}...</p>
      <button onClick={() => handleCurrentPage("-")}>Previous</button>
    </div>
  );
};

const UpcomingEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const [maxViewEvent, setMaxViewEVent] = useState(5);
  const [minViewEvent, setMinViewEvent] = useState(0);

  useEffect(() => {
    if (currentPage === 0) {
      setMinViewEvent(0);
      setMaxViewEVent(5);
    }

    if (currentPage > 0) {
      setMaxViewEVent(currentPage * 5);
    }
  }, [currentPage]);

  useEffect(() => {
    setMinViewEvent(maxViewEvent - 5);
  }, [maxViewEvent]);

  return (
    <div>
      <h1>Upcoming events page</h1>
      <Events minViewEvent={minViewEvent} maxViewEVent={maxViewEvent} />
      <PageToView currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default UpcomingEventsPage;
