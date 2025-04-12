import { useEffect, useRef, useState } from "react";
import classes from "./upcomingEvents.module.scss";

const Event = ({ title, date, image, country, city }) => {
  return (
    <div className={classes.event}>
      <h1>{title}</h1>
      <img src={image.url} alt="" />
      <div className={classes.subInfo}>
        <h4>{date}</h4>
        <h5>
          {country} - {city}
        </h5>
      </div>
    </div>
  );
};

export default Event;
