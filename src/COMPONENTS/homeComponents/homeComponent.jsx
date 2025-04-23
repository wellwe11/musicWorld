import { useEffect } from "react";
import classes from "./homeComponent.module.scss";
import { findFittingImage } from "../../PAGES/functions/findFittingImage";

const EventsImagesWheel = ({ eventsArray }) => {
  const logStuff = (e) => {
    console.log(e);
  };

  return (
    <div className={classes.pictureSliderContainer}>
      {eventsArray?.map((event, index) => (
        <div key={index} className={classes.pictureSliderImage}>
          {index < 6 && (
            <div onClick={() => logStuff(event)}>
              <img src={findFittingImage(event?.images, "4_3")} alt="" />
            </div>
          )}
        </div>
      ))}
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
