import { useEffect, useRef, useState } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { findFittingImage } from "../../PAGES/functions/findFittingImage";

const Events = ({
  eventsArray,
  loading,
  maxViewEvent,
  minViewEvent,
  interestedArtists,
  setInterestedArtists,
  clickedEvent,
  setClickedEvent,
  imageClicked,
  setImageClicked,
  setArtist,
}) => {
  // useState for loading (via the useContext(eventContext)). I need it for setTimeout
  const [displayEvents, setDisplayEvents] = useState(false);

  const displayEventRef = useRef([]);

  // displays loading before the fetches are finalized. Loading is stored in the same component
  // such as the fetch. Loading is then turned true or false depending on the return of the JSON
  useEffect(() => {
    if (!loading) {
      setDisplayEvents(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!displayEvents) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("show");
          entry.target.style.willChange = "opacity";
          entry.target.classList.add(classes.show);
          setTimeout(() => {
            entry.target.style.willChange = "";
          }, 700);
        } else {
          console.log("hide");
          entry.target.classList.remove(classes.show);
          entry.target.style.willChange = "";
        }
      });
    });

    displayEventRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      displayEventRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });

      observer.disconnect();
    };
  }, [eventsArray, maxViewEvent, minViewEvent, loading, displayEvents]);

  return (
    <div className={classes.events}>
      {displayEvents &&
        eventsArray?.map(
          (event, index) =>
            index >= minViewEvent &&
            index <= maxViewEvent && (
              <div
                key={index}
                className={classes.eventContainer}
                ref={(el) => (displayEventRef.current[index] = el)}
              >
                <Event
                  title={
                    event?.artist?._embedded?.attractions?.[0]?.name ||
                    event?.artist?.name
                  }
                  date={event?.event?.dates?.start?.localDate}
                  dateEnd={
                    event?.otherEvents?.length > 0 ? event?.otherEvents : ""
                  }
                  image={findFittingImage(event?.artist?.images, "16_9", 500)}
                  country={event?.event?._embedded?.venues[0]?.country?.name}
                  city={event?.event?._embedded?.venues[0]?.city?.name}
                  location={event?.event?._embedded?.venues[0]?.address?.line1}
                  clickedEvent={clickedEvent}
                  setClickedEvent={setClickedEvent}
                  artistId={event.artist.id}
                  imageClicked={
                    clickedEvent === event.artist.id ? imageClicked : ""
                  }
                  setImageClicked={setImageClicked}
                  onClickLink={
                    event?.event?._embedded?.attractions?.[0]?.url || event?.url
                  }
                  interestedArtists={interestedArtists}
                  setInterestedArtists={setInterestedArtists}
                  artist={event?.artist}
                  setArtist={setArtist}
                  event={event}
                />
              </div>
            )
        )}
    </div>
  );
};

export default Events;
