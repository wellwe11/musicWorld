import React from "react";
import LoadingSvg from "../COMPONENTS/artistPageComponents/media/loadingSvg";
import HomePageComponent from "../COMPONENTS/homeComponents/homeComponent";

import classes from "./defaultPage.module.scss";

const HomePage = React.memo(function HomePage({
  eventsArray,
  interestedArtists,
  setInterestedArtists,
  country,
  setDateFrom,
  setArtist,
}) {
  return (
    <div className={classes.homePage}>
      <HomePageComponent
        eventsArray={eventsArray}
        interestedArtists={interestedArtists}
        setInterestedArtists={setInterestedArtists}
        country={country}
        setDateFrom={setDateFrom}
        setArtist={setArtist}
      />
    </div>
  );
});

export default HomePage;
