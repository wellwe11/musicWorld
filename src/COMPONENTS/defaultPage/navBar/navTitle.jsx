import classes from "./navArea.module.scss";

import logoImage from "./images/logoImage.png";

const NavTitle = () => {
  return (
    <div className={classes.navTitleContainer}>
      <img src={logoImage} alt="" />
    </div>
  );
};

export default NavTitle;
