import { useNavigate, useParams } from "react-router-dom";

import classes from "./navArea.module.scss";
import NavButton from "./navButton";
import NavTitle from "./navTitle";
import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../searchInput/searchInput";

import dateIcon from "./images/date.png";
import dateTillIcon from "./images/dateTill.png";
import clearIcon from "./images/clear.png";
import musicIcon from "./images/music.png";
import searchIcon from "./images/search.png";

import homeIcon from "./images/home.png";
import aboutUsIcon from "./images/info.png";
import eventsIcon from "./images/events.png";
import accountIcon from "./images/account.png";

const ExtendedButtons = ({
  setDateFrom,
  setDateTill,
  dateFrom,
  dateTill,
  genre,
  setGenre,
  setArtist,
  artist,
}) => {
  const inputRefOne = useRef();
  const inputRefTwo = useRef();
  const [localDateFrom, setLocalDateFrom] = useState();
  const [localDateTill, setLocalDateTill] = useState();
  const [localGenre, setLocalGenre] = useState();
  const [genreClicked, setGenreClicked] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const { home, name } = useParams();
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
    setDateFrom("");
    setDateTill("");
    setLocalDateFrom("");
    setLocalDateTill("");
    setLocalGenre("");
    setGenre("");
    setArtist("");
    setStartSearch(false);
  };

  const handleDatedFetch = () => {
    if (localDateFrom && localDateTill) {
      setStartSearch(true);
      setDateFrom(localDateFrom);
      setDateTill(localDateTill);
    } else if (localDateFrom && !localDateTill) {
      setStartSearch(true);
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
      setStartSearch(true);
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

  useEffect(() => {
    if (dateFrom || dateTill || genre) {
      setStartSearch(true);
    }

    if (genre) {
      setLocalGenre(genre);
    }

    if (dateFrom) {
      setLocalDateFrom(dateFrom);
    }

    if (dateTill) {
      setLocalDateTill(dateTill);
    }
  }, [dateFrom, dateTill, genre, artist]);

  return (
    <div className={classes.extendedButtons}>
      <div className={classes.extendedButtonsWrapper}>
        <>
          <NavButton
            onClick={handleDateFromShowPicker}
            externalClass={`${localDateFrom ? classes.buttonTarget : ""}`}
          >
            <p>{localDateFrom || dateFrom || "Date from"}</p>
            <img src={dateIcon} alt="" />
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
            <p>{localDateTill || dateTill || "Date till"}</p>
            <img src={dateTillIcon} alt="" />
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
          {name === "upcomingEvents" && (
            <NavButton
              onClick={handleGenreClicked}
              externalClass={`${
                localGenre || genreClicked ? classes.buttonTarget : ""
              }`}
            >
              <p>{musicGenres[localGenre] || musicGenres[genre] || "Genre"}</p>
              <img src={musicIcon} alt="" />
            </NavButton>
          )}
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
          <p>Search filter</p>
          <img src={searchIcon} alt="" />
        </NavButton>
        <NavButton onClick={handleClearFilter}>
          <img src={clearIcon} alt="" />
          <p>Clear filter</p>
        </NavButton>
      </div>
    </div>
  );
};

const NavBar = ({
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
      if (`home/${name}` === Object.values(buttonsObject)[i].link) {
        setActiveButton(i);
      } else if (!name) {
        setActiveButton(0);
      }
    }

    if (name === "artistPage") {
      setActiveButton(null);
    }
  }, [name]);

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  const buttonsObject = {
    home: {
      icon: homeIcon,
      link: "home",
    },
    events: {
      icon: eventsIcon,
      link: "home/upcomingEvents",
    },
    "about us": {
      icon: aboutUsIcon,
      link: "home/aboutUs",
    },

    account: {
      icon: accountIcon,
      link: "home/account",
    },
  };

  return (
    <div className={`${classes.navBarContainer}`}>
      <div className={classes.navBarWrapper}>
        <NavTitle />
        <SearchInput
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTill={dateTill}
          setDateTill={setDateTill}
          genre={genre}
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
            activeButton > 0 ? classes.buttonActive : ""
          }`}
        >
          <div className={classes.navBarButtonsWrapper}>
            {Object.keys(buttonsObject).map((el, index) => (
              <NavButton
                onClick={() => {
                  handleNavigate(buttonsObject[el].link);
                  setActiveButton(index);
                }}
                key={index}
                externalClass={
                  activeButton === index ? classes.buttonTarget : ""
                }
              >
                <p>{el}</p>
                <img src={buttonsObject[el].icon} alt="" />
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
              artist={artist}
              setCity={setCity}
              city={city}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
