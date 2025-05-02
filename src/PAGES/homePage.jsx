import HomePageComponent from "../COMPONENTS/homeComponents/homeComponent";

import classes from "./defaultPage.module.scss";

const HomePage = ({ eventsArray, interestedArtists, setInterestedArtists }) => {
  return (
    <div className={classes.homePage}>
      <HomePageComponent
        eventsArray={eventsArray}
        interestedArtists={interestedArtists}
        setInterestedArtists={setInterestedArtists}
      />
    </div>
  );
};

export default HomePage;
