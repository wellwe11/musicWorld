import classes from "./footer.module.scss";

const FooterButtons = ({ buttons, buttonsTitle }) => {
  return (
    <div className={classes.footerButtonsWrapper}>
      <h4>{buttonsTitle}</h4>
      {buttons.map((button, index) => (
        <button key={index}>{button}</button>
      ))}
    </div>
  );
};

const FooterInformation = () => {
  const us = ["Who Are We", "Find Locations", "Partners", "Our Future"];
  const brand = ["Style & Fit", "Technology", "Press", "Events"];
  const help = [
    "Shipping & Returns",
    "Repairs",
    "Warranty",
    "FAQ",
    "Contact Us",
  ];

  return (
    <div className={classes.footerButtonsContainer}>
      <FooterButtons buttons={us} buttonsTitle={"US"} />
      <FooterButtons buttons={brand} buttonsTitle={"BRAND"} />
      <FooterButtons buttons={help} buttonsTitle={"HELP"} />
    </div>
  );
};

const FooterInformationTwo = () => {
  return (
    <div className={classes.footerInformationTwo}>
      <div className={classes.headerContainer}>
        <h3>CONTACT US FOR FURTHER INFORMATION</h3>
      </div>
      <p>
        Whether you're a collector or visiting for the first time, we're here to
        assist!
      </p>
      <div className={classes.pContainer}>
        <p>+12 345 6789 10</p>
        <p> || </p>
        <p>RyanderEmail@someEmail.com</p>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContainer}>
        <FooterInformation />
        <div className={classes.seperatorLine}></div>
        <FooterInformationTwo />
      </div>
    </footer>
  );
};

export default Footer;
