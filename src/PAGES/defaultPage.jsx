import classes from "./defaultPage.module.scss";

import SearchInput from "../COMPONENTS/defaultPage/searchInput/searchInput";
import NavBar from "../COMPONENTS/defaultPage/navBar/navBar";

const DefaultUI = () => {
  return (
    <div className={classes.defaultUIContainer}>
      <NavBar />
    </div>
  );
};

export default DefaultUI;
