import { useNavigate, useParams } from "react-router-dom";
import classes from "./navArea.module.scss";
import NavButton from "./navButton";
import NavTitle from "./navTitle";
import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../searchInput/searchInput";

const ExtendedButtons = ({ setDateFrom, setDateTill, dateFrom, dateTill }) => {
  const inputRefOne = useRef();
  const inputRefTwo = useRef();
  const [localDateFrom, setLocalDateFrom] = useState();
  const [localDateTill, setLocalDateTill] = useState();

  const today = new Date().toISOString().split("T")[0];

  const handleDateFromShowPicker = () => {
    inputRefOne?.current?.showPicker();
  };

  const handleDateTillShowPicker = () => {
    inputRefTwo?.current?.showPicker();
  };

  const handleClearFilter = () => {
    setDateFrom(null);
    setDateTill(null);
    setLocalDateFrom(null);
    setLocalDateTill(null);
  };

  useEffect(() => {
    console.log(dateFrom, dateTill);
  }, [dateFrom, dateTill]);

  const handleDatedFetch = () => {
    setDateFrom(localDateFrom);
    setDateTill(localDateTill);
  };

  return (
    <div className={classes.extendedButtons}>
      <div className={classes.extendedButtonsWrapper}>
        <>
          <NavButton onClick={handleDateFromShowPicker}>
            {localDateFrom || dateFrom || "Date from"}
          </NavButton>
          <input
            type="date"
            ref={inputRefOne}
            style={{
              width: "0px",
              height: "0px",
              opacity: "0",
            }}
            min={today}
            max={localDateTill || dateFrom || ""}
            onChange={(e) => setLocalDateFrom(e.target.value)}
          />
        </>
        <>
          <NavButton onClick={handleDateTillShowPicker}>
            {localDateTill || dateTill || "Date till"}
          </NavButton>
          <input
            type="date"
            ref={inputRefTwo}
            style={{
              width: "0px",
              height: "0px",
              opacity: "0",
            }}
            min={localDateFrom || dateFrom || today}
            onChange={(e) => setLocalDateTill(e.target.value)}
          />
        </>
        <NavButton onClick={handleDatedFetch}>Search</NavButton>
        <NavButton onClick={handleClearFilter}>Clear filter</NavButton>
      </div>
    </div>
  );
};

const NavBar = ({ setDateFrom, setDateTill, dateFrom, dateTill }) => {
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
      <SearchInput />
      <div
        className={`${classes.navBarButtons} ${
          !activeButton > 0 ? classes.buttonActive : ""
        }`}
      >
        <div className={classes.navBarButtonsWrapper}>
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
        {name === "upcomingEvents" && (
          <ExtendedButtons
            setDateFrom={setDateFrom}
            setDateTill={setDateTill}
            dateFrom={dateFrom}
            dateTill={dateTill}
          />
        )}
      </div>
    </div>
  );
};

export default NavBar;
