import { useNavigate, useParams } from "react-router-dom";
import classes from "./navArea.module.scss";
import NavButton from "./navButton";
import NavTitle from "./navTitle";
import React, { useEffect, useState } from "react";
import SearchInput from "../searchInput/searchInput";

const NavBar = () => {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  const { home, name } = useParams();

  useEffect(() => {
    for (let i = 0; i < Object.keys(buttonsObject).length; i++) {
      if (`home/${name}` === Object.values(buttonsObject)[i]) {
        setActiveButton(i);
      }
      if (!name) {
        setActiveButton(0);
      }
    }
  }, []);

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  const buttonsObject = {
    home: "home",
    "Upcoming events": "home/upcomingEvents",
    "About us": "home/aboutUs",
    Account: "home/account",
  };

  return (
    <div className={classes.navBarContainer}>
      <NavTitle />
      <div className={classes.navButtonsAndSearchBar}>
        <SearchInput />
        <div className={classes.navBarButtons}>
          {Object.keys(buttonsObject).map((el, index) => (
            <NavButton
              onClick={() => {
                handleNavigate(buttonsObject[el]);
                setActiveButton(index);
              }}
              key={index}
              externalClass={activeButton === index ? classes.buttonTarget : ""}
            >
              {el}
            </NavButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
