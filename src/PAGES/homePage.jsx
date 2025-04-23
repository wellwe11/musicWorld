import HomePageComponent from "../COMPONENTS/homeComponents/homeComponent";

import classes from "./defaultPage.module.scss";

const HomePage = ({ events }) => {
  return (
    <div className={classes.homePage}>
      <HomePageComponent events={events} />
    </div>
  );
};

export default HomePage;
