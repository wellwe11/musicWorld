import HomePageComponent from "../COMPONENTS/homeComponents/homeComponent";

import classes from "./defaultPage.module.scss";

const HomePage = ({ eventsArray }) => {
  return (
    <div className={classes.homePage}>
      <HomePageComponent eventsArray={eventsArray} />
    </div>
  );
};

export default HomePage;
