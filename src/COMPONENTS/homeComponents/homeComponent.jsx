import { useEffect, useMemo, useState } from "react";
import classes from "./homeComponent.module.scss";
import { findFittingImage } from "../../PAGES/functions/findFittingImage";

const EventsImagesWheel = ({ eventsArray }) => {
  const [displayEvents, setDisplayEvents] = useState([]);

  const amountOfEventsDisplay = useMemo(() => {
    return eventsArray.map((event) => {
      const eventsImages = event?.images.filter(
        (image) => image.ratio === "16_9" && image.height > 600
      );
      return eventsImages;
    });
  }, [eventsArray]);

  useEffect(() => {
    setDisplayEvents(amountOfEventsDisplay);
  }, [eventsArray]);

  const logStuff = (e) => {
    console.log(e);
  };

  return (
    <div className={classes.pictureSliderContainer}>
      {displayEvents &&
        displayEvents.map(
          (event, index) =>
            index < 6 && (
              <div key={index} className={classes.pictureSliderImage}>
                <div onClick={() => logStuff(event)}>
                  <img src={event?.[0].url} alt="" />
                </div>
              </div>
            )
        )}
    </div>
  );
};

const HomePageComponent = ({ eventsArray }) => {
  return (
    <div className={classes.homePageComponentContainer}>
      <h1>Welcome home</h1>
      <EventsImagesWheel eventsArray={eventsArray} />
    </div>
  );
};

export default HomePageComponent;
