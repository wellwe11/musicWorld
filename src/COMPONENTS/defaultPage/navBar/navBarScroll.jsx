import { useNavigate, useParams } from "react-router-dom";

import classes from "./navAreaScroll.module.scss";
import NavButton from "./navButton";
import NavTitle from "./navTitle";
import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../searchInput/searchInput";

import logoImage from "./images/logoImage.png";

const ExtendedButtons = ({
  setDateFrom,
  setDateTill,
  dateFrom,
  dateTill,
  genre,
  setGenre,
  setArtist,
}) => {
  const inputRefOne = useRef();
  const inputRefTwo = useRef();
  const [localDateFrom, setLocalDateFrom] = useState();
  const [localDateTill, setLocalDateTill] = useState();
  const [localGenre, setLocalGenre] = useState();
  const [genreClicked, setGenreClicked] = useState(false);
  const [startSearch, setStartSearch] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleDateFromShowPicker = () => {
    inputRefOne?.current?.showPicker();
  };

  const handleDateTillShowPicker = () => {
    inputRefTwo?.current?.showPicker();
  };

  const handleGenreClicked = () => {
    const timeout = setTimeout(() => {
      genreClicked ? setGenreClicked(false) : setGenreClicked(true);
    }, 200);

    return () => clearTimeout(timeout);
  };

  const handleClearFilter = () => {
    setDateFrom(null);
    setDateTill(null);
    setLocalDateFrom(null);
    setLocalDateTill(null);
    setLocalGenre(null);
    setGenre(null);
    setArtist(null);
    setStartSearch(false);
  };

  const handleDatedFetch = () => {
    setStartSearch(true);
    if (localDateFrom && localDateTill) {
      setDateFrom(localDateFrom);
      setDateTill(localDateTill);
    } else if (localDateFrom && !localDateTill) {
      const date = new Date(`${localDateFrom}`);
      const tillDate = new Date(new Date(date).setMonth(date.getMonth() + 3));
      const [tillYear, tillMonth, tillDay] = [
        tillDate.getFullYear(),
        tillDate.getMonth(),
        tillDate.getDate(),
      ];

      const formattedTillDate = `${tillYear}-${tillMonth < 9 ? 0 : ""}${
        tillMonth + 1
      }-${tillDay < 10 ? 0 : ""}${tillDay}`;

      setLocalDateTill(formattedTillDate);

      setDateFrom(localDateFrom);
      setDateTill(formattedTillDate);
    }

    if (localGenre) {
      setGenre(localGenre);
    }
  };

  const musicGenres = {
    KnvZfZ7vAeA: "Rock",
    KnvZfZ7vAev: "Pop",
    KnvZfZ7vAv1: "Hip-Hop",
    KnvZfZ7vAee: "R&B",
    KnvZfZ7vAvE: "Jazz",
    KnvZfZ7v7nJ: "Classical",
    KnvZfZ7vAv6: "Country",
    KnvZfZ7vAvF: "Electronic",
    KnvZfZ7vAvt: "Metal",
  };

  useEffect(() => {
    if (genreClicked) {
      window.addEventListener("mousedown", handleGenreClicked);
      return () => window.removeEventListener("mousedown", handleGenreClicked);
    }
  }, [genreClicked]);

  return (
    <div className={classes.extendedButtons}>
      <div className={classes.extendedButtonsWrapper}>
        <>
          <NavButton
            onClick={handleDateFromShowPicker}
            externalClass={`${localDateFrom ? classes.buttonTarget : ""}`}
          >
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
          <NavButton
            onClick={handleDateTillShowPicker}
            externalClass={`${localDateTill ? classes.buttonTarget : ""}`}
          >
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
            onBlur={handleDateTillShowPicker}
          />
        </>
        <>
          <NavButton
            onClick={handleGenreClicked}
            externalClass={`${
              localGenre || genreClicked ? classes.buttonTarget : ""
            }`}
          >
            {musicGenres[localGenre] || musicGenres[genre] || "Genre"}
          </NavButton>
          {genreClicked && (
            <div className={classes.genreContainer}>
              <ul onMouseLeave={handleGenreClicked}>
                {Object.keys(musicGenres).map((genre, index) => (
                  <button
                    onClick={() => {
                      handleGenreClicked();
                      setLocalGenre(genre);
                    }}
                    key={index}
                  >
                    {musicGenres[genre]}
                  </button>
                ))}
              </ul>
            </div>
          )}
        </>
        <NavButton
          onClick={handleDatedFetch}
          externalClass={`${startSearch ? classes.buttonTarget : ""}`}
        >
          Search filter
        </NavButton>
        <NavButton onClick={handleClearFilter}>Clear filter</NavButton>
      </div>
    </div>
  );
};

const NavBarScroll = ({
  setDateFrom,
  setDateTill,
  dateFrom,
  dateTill,
  genre,
  setGenre,
  country,
  setCountry,
  city,
  setCity,
  artist,
  setArtist,
  events,
}) => {
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
    Home: "home",
    Events: "home/upcomingEvents",
    "About us": "home/aboutUs",
    Account: "home/account",
  };

  return (
    <div className={`${classes.navBarContainerScroll}`}>
      <img className={classes.logoScroll} src={logoImage} alt="" />
      <SearchInput
        setDateFrom={setDateFrom}
        setDateTill={setDateTill}
        setGenre={setGenre}
        country={country}
        setCountry={setCountry}
        city={city}
        setCity={setCity}
        events={events}
        artist={artist}
        setArtist={setArtist}
      />
      <div
        className={`${classes.navBarButtons} ${
          activeButton === 0 ? classes.buttonHomeActive : ""
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
            setGenre={setGenre}
            genre={genre}
            setArtist={setArtist}
            setCity={setCity}
          />
        )}
      </div>
    </div>
  );
};

export default NavBarScroll;
