import { useContext, useEffect, useRef } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { EventContext } from "../../App";

const Events = () => {
  const { events, loading } = useContext(EventContext);
  // ref for effect below
  const elementsRef = useRef([]);

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

  return (
    <div className={classes.events}>
      {!loading &&
        events.map((event, index) => (
          <div
            key={index}
            ref={(el) => (elementsRef.current[index] = el)}
            className={classes.eventContainer}
          >
            <Event
              title={event.name}
              date={event.dates.start.dateTime}
              image={event.images[0]}
              location={event.locale}
            />
          </div>
        ))}
    </div>
  );
};

export default Events;
