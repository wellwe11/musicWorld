import { useContext, useEffect, useRef, useState } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { EventContext } from "../../App";

const Events = ({ eventsArray, loading, maxViewEVent, minViewEvent }) => {
  // useState for loading (via the useContext(eventContext)). I need it for setTimeout
  const [displayEvents, setDisplayEvents] = useState(false);

  // events are the displayed events. Loading is turned false if the fetch is successful

  // this is a state used inside of each event which is passed as a prop.
  // It forces a single-play option. Otherwise, if a user wants to click several
  // events to hear music, it'll play them all at the same time.
  // Having this state in parent, you avoid this as it can only be true
  // for one child
  const [imageClicked, setImageClicked] = useState(false);

  // a local state to track which event has clicked it's play button. Helps avoid all children
  // click play once you interact with an element
  const [clickedEvent, setClickedEvent] = useState(null);

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
