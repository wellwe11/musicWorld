import { useEffect, useState } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { findFittingImage } from "../../PAGES/functions/findFittingImage";

const Events = ({
  eventsArray,
  loading,
  maxViewEVent,
  minViewEvent,
  interestedArtists,
  setInterestedArtists,
  clickedEvent,
  setClickedEvent,
  imageClicked,
  setImageClicked,
}) => {
  // useState for loading (via the useContext(eventContext)). I need it for setTimeout
  const [displayEvents, setDisplayEvents] = useState(false);

  // displays loading before the fetches are finalized. Loading is stored in the same component
  // such as the fetch. Loading is then turned true or false depending on the return of the JSON
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setDisplayEvents(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className={classes.events}>
      {displayEvents &&
        eventsArray?.map(
          (event, index) =>
            index >= minViewEvent &&
            index <= maxViewEVent && (
              <div key={index} className={classes.eventContainer}>
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
                />
              </div>
            )
        )}
    </div>
  );
};

export default Events;
