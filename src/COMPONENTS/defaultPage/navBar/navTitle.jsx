import classes from "./navArea.module.scss";

import logoImage from "./images/logoImage.png";
import { useNavigate } from "react-router-dom";

const NavTitle = () => {
  const navigate = useNavigate();

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  return (
    <div
      className={classes.navTitleContainer}
      onClick={() => handleNavigate("./home")}
    >
      <img src={logoImage} alt="" />
    </div>
  );
};

export default NavTitle;
