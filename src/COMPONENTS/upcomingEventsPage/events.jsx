import { useContext, useEffect, useRef, useState } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { EventContext } from "../../App";

const Events = () => {
  const [displayEvents, setDisplayEvents] = useState(false);
  const { events, loading } = useContext(EventContext);
  const [imageClicked, setImageClicked] = useState(false);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [eventsArray, setEventsArray] = useState([]);

  // create an array that looks for same artists and if the
  // same band is "beside" itself on several days, just merge the
  // dates instead so that they dont take too much space

  // ref for effect below
  const elementsRef = useRef([]);

  useEffect(() => {
    console.log(loading, "loading...");
    if (!loading) {
      const timer = setTimeout(() => {
        setDisplayEvents(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  });

  const addEvents = () => {
    const updatedArray = [];
    const idSet = new Set();

    events?.events?.forEach((event) => {
      const idToNotMatch = event?._embedded?.attractions[0]?.id;
      if (idToNotMatch && !idSet.has(idToNotMatch)) {
        idSet.add(idToNotMatch);
        updatedArray.push(event);
      }
    });

    if (updatedArray.length > 0) {
      setEventsArray(updatedArray);
    }
  };

  useEffect(() => {
    addEvents();
  }, [events]);

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
      {displayEvents ? (
        eventsArray.map((event, index) => (
          <div
            key={index}
            ref={(el) => (elementsRef.current[index] = el)}
            className={classes.eventContainer}
            onClick={() => setClickedEvent(index)}
          >
            <Event
              title={event?._embedded?.attractions[0]?.name}
              date={event?.dates?.start?.localDate}
              image={event?.images[0]}
              country={event?._embedded?.venues[0]?.country?.name}
              city={event?._embedded?.venues[0]?.city?.name}
              location={event?._embedded?.venues[0]?.address?.line1}
              imageClicked={clickedEvent === index ? imageClicked : ""}
              setImageClicked={setImageClicked}
              onClickLink={event?._embedded?.attractions[0]?.url}
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
