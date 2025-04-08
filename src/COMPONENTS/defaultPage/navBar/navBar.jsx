import { useNavigate } from "react-router-dom";
import classes from "./navArea.module.scss";
import NavButton from "./navButton";
import NavTitle from "./navTitle";

const NavBar = () => {
  const navigate = useNavigate();

  const handleNavigate = (link) => {
    navigate(`/${link}`);
  };

  return (
    <div className={classes.navBarContainer}>
      <NavTitle />
      <div className={classes.navBarButtons}>
        <NavButton onClick={() => handleNavigate("home")}>Home</NavButton>
        <NavButton onClick={() => handleNavigate("home/upcomingEvents")}>
          Upcoming events
        </NavButton>
        <NavButton onClick={() => handleNavigate("home/aboutUs")}>
          About us
        </NavButton>
        <NavButton onClick={() => handleNavigate("home/account")}>
          Account
        </NavButton>
      </div>
    </div>
  );
};

export default NavBar;
