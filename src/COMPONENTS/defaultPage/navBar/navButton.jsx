import classes from "./navArea.module.scss";

const NavButton = ({ children }) => {
  return (
    <div className={classes.navButtonContainer}>
      <button>{children}</button>
    </div>
  );
};

export default NavButton;
