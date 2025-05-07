import HomePageComponent from "../COMPONENTS/homeComponents/homeComponent";

import classes from "./defaultPage.module.scss";

const HomePage = ({
  eventsArray,
  interestedArtists,
  setInterestedArtists,
  country,
  setDateFrom,
}) => {
  return (
    <div className={classes.homePage}>
      <HomePageComponent
        eventsArray={eventsArray}
        interestedArtists={interestedArtists}
        setInterestedArtists={setInterestedArtists}
        country={country}
        setDateFrom={setDateFrom}
      />
    </div>
  );
};

export default HomePage;
