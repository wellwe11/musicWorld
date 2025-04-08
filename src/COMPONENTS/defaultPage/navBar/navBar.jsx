import classes from "./navArea.module.scss";
import NavButton from "./navButton";
import NavTitle from "./navTitle";

const NavBar = () => {
  return (
    <div className={classes.navBarContainer}>
      <NavTitle />
      <div className={classes.navBarButtons}>
        <NavButton>Do something</NavButton>
        <NavButton>Do something</NavButton>
        <NavButton>Do something</NavButton>
        <NavButton>Do something</NavButton>
      </div>
    </div>
  );
};

export default NavBar;
