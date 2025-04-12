import { useContext, useEffect, useRef, useState } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { EventContext } from "../../App";

const Events = () => {
  const [displayEvents, setDisplayEvents] = useState(false);
  const { events, loading } = useContext(EventContext);

  // ref for effect below
  const elementsRef = useRef([]);

  useEffect(() => {
    console.log(loading, "loading...");
    if (!loading) {
      setTimeout(() => {
        setDisplayEvents(true);
      }, 1000);
    }
  });

  // creates a smooth transition for events to make them look a bit
  // nicer when scrolling
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("show");
          entry.target.classList.add(classes.show);
        } else {
          entry.target.classList.remove(classes.show);
        }
      });
    });

    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });

  console.log(events);

  return (
    <div className={classes.events}>
      {displayEvents ? (
        events.events.map((event, index) => (
          <div
            key={index}
            ref={(el) => (elementsRef.current[index] = el)}
            className={classes.eventContainer}
          >
            <Event
              title={event._embedded.attractions[0].name}
              date={event.dates.start.localDate}
              image={event.images[0]}
              country={event._embedded.venues[0].country.name}
              city={event._embedded.venues[0].city.name}
            />
          </div>
        ))
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
};

export default Events;
