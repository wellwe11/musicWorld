import { useEffect, useMemo, useState } from "react";
import classes from "./homeComponent.module.scss";
import { findFittingImage } from "../../PAGES/functions/findFittingImage";
import BandText from "./pictureSliderTexts";

const EventsImagesWheel = ({ eventsArray }) => {
  const [displayEvents, setDisplayEvents] = useState([]);

  const [displayedImage, setDisplayedImage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedImage((prev) => (prev < 5 ? prev + 1 : 0));
    }, 12500);

    return () => clearTimeout(timer);
  }, [displayedImage]);

  useEffect(() => {
    console.log(displayedImage);
  }, [displayedImage]);

  const amountOfEventsDisplay = useMemo(() => {
    return eventsArray.map((event, index) => {
      const eventsImages = event?.images.filter(
        (image) => image.ratio === "16_9" && image.height > 1000
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

  const displayedImageAdd = () => {
    setDisplayedImage((prev) => (prev < 5 ? prev + 1 : 0));
  };

  const displayedImageMinus = () => {
    setDisplayedImage((prev) => (prev > 0 ? prev - 1 : 5));
  };

  return (
    <div className={classes.pictureSliderContainer}>
      {displayEvents &&
        displayEvents.map(
          (event, index) =>
            index < 6 &&
            index === displayedImage && (
              <div
                key={index}
                className={`${classes.pictureSliderImage} ${
                  index === displayedImage ? classes.displayedImage : ""
                }`}
              >
                <button onClick={displayedImageMinus}>Prev</button>
                <div
                  className={classes.imageContainer}
                  onClick={() => logStuff(event)}
                >
                  <img src={event?.[0]?.url} alt="" />

                  <BandText data={eventsArray[index]} index={index} />
                </div>
                <button onClick={displayedImageAdd}>Next</button>
              </div>
            )
        )}
    </div>
  );
};

const ArtistProfile = () => {
  return (
    <div className={classes.artistWrapper}>
      <div className={classes.imageContainer}>Image of artist</div>
      <div className={classes.artistTitle}>
        <h4>Name of artist</h4>
      </div>
    </div>
  );
};

const PopularArtistsNear = () => {
  return (
    <div className={classes.popularArtistsContainer}>
      <h3>{"Artists near you..."}</h3>

      <div className={classes.popularArtistsWrapper}>
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
        <ArtistProfile />
      </div>
    </div>
  );
};

const HomePageComponent = ({ eventsArray }) => {
  return (
    <div className={classes.homePageComponentContainer}>
      <PopularArtistsNear />
      <EventsImagesWheel eventsArray={eventsArray} />
    </div>
  );
};

export default HomePageComponent;
