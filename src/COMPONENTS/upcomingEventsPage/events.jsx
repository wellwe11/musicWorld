import { useContext, useEffect, useRef, useState } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { EventContext } from "../../App";

const Events = ({ maxViewEVent, minViewEvent }) => {
  // useState for loading (via the useContext(eventContext)). I need it for setTimeout
  const [displayEvents, setDisplayEvents] = useState(false);

  // events are the displayed events. Loading is turned false if the fetch is successful
  const { events, loading } = useContext(EventContext);

  // this is a state used inside of each event which is passed as a prop.
  // It forces a single-play option. Otherwise, if a user wants to click several
  // events to hear music, it'll play them all at the same time.
  // Having this state in parent, you avoid this as it can only be true
  // for one child
  const [imageClicked, setImageClicked] = useState(false);

  //
  // a local state to track which event has clicked it's play button. Helps avoid all children
  // click play once you interact with an element
  const [clickedEvent, setClickedEvent] = useState(null);

  // a new array containing filtered events to avoid duplicates
  const [eventsArray, setEventsArray] = useState([]);

  // create an array that looks for same artists and if the
  // same band is "beside" itself on several days, just merge the
  // dates instead so that they dont take too much space

  // displays loading before the fetches are finalized. Loading is stored in the same component
  // such as the fetch. Loading is then turned true or false depending on the return of the JSON
  useEffect(() => {
    console.log(loading, "loading...");

    if (!loading) {
      const timer = setTimeout(() => {
        setDisplayEvents(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  });

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
    <div className={classes.events}>
      {displayEvents ? (
        eventsArray.map(
          (event, index) =>
            index >= minViewEvent &&
            index <= maxViewEVent && (
              <div
                key={index}
                className={classes.eventContainer}
                onClick={() => setClickedEvent(index)}
              >
                <Event
                  title={
                    event?._embedded?.attractions?.[0]?.name || event?.name
                  }
                  date={event?.dates?.start?.localDate}
                  image={event?.images[0]}
                  country={event?._embedded?.venues[0]?.country?.name}
                  city={event?._embedded?.venues[0]?.city?.name}
                  location={event?._embedded?.venues[0]?.address?.line1}
                  imageClicked={clickedEvent === index ? imageClicked : ""}
                  setImageClicked={setImageClicked}
                  onClickLink={
                    event?._embedded?.attractions?.[0]?.url || event?.url
                  }
                />
              </div>
            )
        )
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
};

export default Events;
