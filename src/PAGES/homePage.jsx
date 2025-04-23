import HomePageComponent from "../COMPONENTS/homeComponents/homeComponent";

import classes from "./defaultPage.module.scss";

const HomePage = () => {
  return (
    <div className={classes.homePage}>
      <HomePageComponent />
    </div>
  );
};

export default HomePage;
