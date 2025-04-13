import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import classes from "./upcomingEvents.module.scss";

const TicketButton = ({ onClickLink }) => {
  const navigateToWebsite = () => {
    window.open(onClickLink);
  };

  return (
    <div className={classes.ticketButton}>
      <button onClick={navigateToWebsite}>Tickets</button>
    </div>
  );
};

export default TicketButton;
