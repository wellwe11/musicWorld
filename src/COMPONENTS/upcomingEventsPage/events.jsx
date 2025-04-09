import { useContext } from "react";
import Event from "./eventComp";

import classes from "./upcomingEvents.module.scss";
import { EventContext } from "../../App";

const Events = () => {
  const { events, loading } = useContext(EventContext);

  return (
    <div className={classes.events}>
      {!loading &&
        events.map((event, index) => (
          <div key={index}>
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
