import { useNavigate } from "react-router-dom";
import classes from "./footer.module.scss";

const FooterButtons = ({ buttons, buttonsTitle, clickEvent }) => {
  const pages = {
    Home: "home",
    Events: "home/upcomingEvents",
    "About us": "home/aboutUs",
    Account: "home/account",
  };

  return (
    <div className={classes.footerButtonsWrapper}>
      <h3>{buttonsTitle}</h3>
      {buttons.map((button, index) => (
        <button key={index} onClick={() => clickEvent(pages[button])}>
          {button}
        </button>
      ))}
    </div>
  );
};

const FooterInformation = () => {
  const navigate = useNavigate();
  const tabs = ["Home", "Events", "About us", "Account"];

  const handleEvent = (link) => {
    navigate(`/${link}/`);
  };

  return (
    <div className={classes.footerButtonsContainer}>
      <FooterButtons
        buttons={tabs}
        buttonsTitle={"Tabs"}
        clickEvent={handleEvent}
      />
    </div>
  );
};

const FooterInformationTwo = () => {
  return (
    <div className={classes.footerInformationTwo}>
      <div className={classes.headerContainer}>
        <h3>CONTACT:</h3>
      </div>
      <div className={classes.pContainer}>
        <p>robin1ryan@hotmail.com</p>
      </div>
    </div>
  );
};

const CopyRightSection = () => {
  return (
    <div className={classes.copyRightContainer}>
      <h4>© Copyright 2025. All Rights Reserved</h4>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContainer}>
        {/* <FooterInformation />

        <FooterInformationTwo /> */}
      </div>
      <CopyRightSection />
    </footer>
  );
};

export default Footer;
