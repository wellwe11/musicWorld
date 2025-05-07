import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";
import {
  isoCountries,
  regionsNotCountries,
  musicGenres,
  bigCities,
} from "./inputInformation.jsx";
import { useNavigate, useParams } from "react-router-dom";

import closeButton from "./close.png";
import arrowButton from "./sort-arrows-couple-pointing-up-and-down.png";
import LoadingSvg from "../../artistPageComponents/media/loadingSvg.jsx";

const CountrySelect = ({ getter, setter, object, textValue, needsClose }) => {
  // hook for main-buttons to toggle on click
  const [containerClicked, setContainerClicked] = useState(false);

  // a local variable that stores the names of countries and cities - needed because the API takse,
  // i.e. DE instead of Germany, hence, using local storage to seperate the logic for displaying the whole country-name
  const [localSetter, setLocalSetter] = useState();

  // ref to allow for a smoother close on the cities/countries which are displayed once you click the main-buttons
  const mouseTarget = useRef(null);

  // display countries/cities
  const handleContainerClicked = (e) => {
    // because enter on keybaord triggers div to be displayed, so need to check if it is a mouse-click instead
    if (e && e.nativeEvent.pointerType === "mouse") {
      const timeout = setTimeout(() => {
        containerClicked
          ? setContainerClicked(false)
          : setContainerClicked(true);
      }, 50);

      return () => clearTimeout(timeout);
    }
  };

  const handleContainerClickedInstant = () => {
    setTimeout(() => {
      return containerClicked
        ? setContainerClicked(false)
        : setContainerClicked(true);
    }, 100);
  };

  useEffect(() => {
    let indexOfItem = object.indexOf(getter);

    if (textValue) {
      setLocalSetter(
        textValue[indexOfItem].charAt(0).toUpperCase() +
          textValue[indexOfItem].slice(1)
      );
    } else {
      setLocalSetter(getter.charAt(0).toUpperCase() + getter.slice(1));
    }
  }, [getter]);

  useEffect(() => {
    if (containerClicked) {
      window.addEventListener("mousedown", handleContainerClickedInstant);
      return () =>
        window.removeEventListener("mousedown", handleContainerClickedInstant);
    }
  }, [containerClicked]);

  return (
    <div className={classes.countrySelect}>
      <div className={classes.countrySelectInnerWrapper}>
        {containerClicked && (
          <div
            className={`${classes.countriesContainer} ${
              containerClicked ? classes.containerClicked : ""
            }`}
            ref={mouseTarget}
            onMouseLeave={handleContainerClicked}
          >
            {object.map((value, index) => (
              <button
                onClick={() => {
                  setter(value);
                }}
                key={index}
              >
                {textValue
                  ? textValue[index].charAt(0).toUpperCase() +
                    textValue[index].slice(1).toString("").replace(/_/g, " ")
                  : value.charAt(0).toUpperCase() +
                    value.slice(1).replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )}
        {localSetter && localSetter.length > 1 ? (
          <div
            className={classes.optionsDropDownContainer}
            style={{
              display: "flex",
            }}
          >
            <button onClick={handleContainerClicked}>
              {localSetter.replace(/_/g, " ")}
            </button>
            {needsClose && (
              <button className={classes.exitCity} onClick={() => setter("")}>
                <img src={closeButton} alt="" />
              </button>
            )}
          </div>
        ) : (
          <div
            className={classes.optionsDropDownContainer}
            style={{
              display: "flex",
            }}
          >
            <button
              className={classes.optionsTarget}
              onClick={handleContainerClicked}
            >
              Select city
            </button>
            {needsClose && (
              <button
                className={classes.exitCity}
                onClick={handleContainerClicked}
              >
                <img
                  src={arrowButton}
                  alt=""
                  className={containerClicked ? classes.inverted : ""}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SearchInput = ({
  dateFrom,
  setDateFrom,
  dateTill,
  setDateTill,
  genre,
  setGenre,
  country,
  setCountry,
  city,
  setCity,
  setArtist,
}) => {
  const navigate = useNavigate();
  const { name } = useParams();

  const [displayLoadingIcon, setDisplayLoadingIcon] = useState(false);

  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    if (e.key === "Enter") {
      console.log(e.target.value);
      setInput(e.target.value);
      e.target.value = "";
    }
  };

  const countryMatch = () =>
    Object.entries(bigCities)?.find(([, obj]) =>
      Object.keys(obj)?.includes(input.toString("").toLowerCase())
    );

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  const clearLoadingIcon = () => {
    const loadingBoolean = (value) => {
      if (value) {
        setDisplayLoadingIcon(true);
        setTimeout(() => {
          return setDisplayLoadingIcon(false);
        }, 1250);
      } else {
        return setDisplayLoadingIcon(false);
      }
    };

    if (name === "upcomingEvents") {
      loadingBoolean(true);
      console.log("true");
    } else {
      loadingBoolean(false);
      console.log("false");
    }
  };

  useEffect(() => {
    clearLoadingIcon();
  }, [dateFrom, dateTill, genre, country, city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let checkedInput = input.toString("").toLowerCase();

    // pre-define values to help faster rendering since the handleSubmit is so big
    let countryCodeFound = isoCountries[checkedInput];
    let countryMatchFound = countryMatch();
    let musicGenreFound = musicGenres[checkedInput];

    // clean out items to determine if the input was a date
    let cleanedInput = input.replace(/[^a-zA-Z0-9]/g, "");

    if (cleanedInput && Number(cleanedInput)) {
      const date = new Date(`${input}`);
      const tillDate = new Date(new Date(date).setMonth(date.getMonth() + 3));
      const [year, month, day] = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ];

      const [tillYear, tillMonth, tillDay] = [
        tillDate.getFullYear(),
        tillDate.getMonth(),
        tillDate.getDate(),
      ];

      const formattedDate = `${year}-${month < 9 ? 0 : ""}${month + 1}-${
        day < 10 ? 0 : ""
      }${day}`;

      const formattedTillDate = `${tillYear}-${tillMonth < 9 ? 0 : ""}${
        tillMonth + 1
      }-${tillDay < 10 ? 0 : ""}${tillDay}`;

      setDateFrom(formattedDate);
      setDateTill(formattedTillDate);
      console.log(formattedDate);
      return handleNavigate("home/upcomingEvents");
    }

    // if user writes a string
    else if (input) {
      setInput("");

      if (regionsNotCountries.includes(checkedInput)) {
        console.log("id needed, no ISO avaliable");
      }

      // if user writes country
      if (countryCodeFound) {
        setCity("");
        return setCountry(countryCodeFound);
      }

      if (country === countryCodeFound) {
        console.log(
          "you're searching for a country which is already searched for"
        );
      }

      // if user writes city
      if (
        countryMatchFound &&
        Object.keys(countryMatchFound[1]).includes(checkedInput)
      ) {
        setCountry(countryMatchFound[0]);
        // navigates to events to display events in city
        setCity(checkedInput);

        //-- need to help filter events in city on arist-page
        if (name !== "artistPage") {
          console.log("name !== artistPage");
          setArtist("");
          return handleNavigate("home/upcomingEvents");
        }

        // change to only "return" in future when I want to fix city-section on artist-page
        return handleNavigate("home/upcomingEvents");

        // if user writes country but no ISO countries were initially found
      } else if (
        countryMatchFound &&
        typeof input === "string" &&
        countryMatchFound[0]
      ) {
        console.log("setting country no city");
        setCity("");

        if (name !== "artistPage") {
          setArtist("");
        }

        return setCountry(countryMatchFound[0]);
      }

      // if users input matches a genre
      if (musicGenreFound) {
        setGenre(musicGenreFound);
        setArtist("");

        // display genre-events on eventpage
        return handleNavigate("home/upcomingEvents");
      } else {
        if (!countryCodeFound) {
          let artistName = checkedInput.replace(/ /g, "+");
          setArtist(artistName);
          handleNavigate(`home/artistPage/id=${artistName}`);
          setCity("");

          // artistNames(input);

          setDateTill("");
          setDateFrom("");
          // reset genre becasue search is more specified
          return setGenre("");

          // redirect to artistPage =>
          // on artist-page: display basic info about artist
          // then also display IF artist is playing in city/on date etc
          // if not, simply state it is not

          // if no artist is found =>
          // display "found no artist named 'checkedInput' :("
        }
      }
    }
  };

  return (
    <form
      className={classes.searchInputContainer}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className={classes.searchIcon} onClick={(e) => handleSubmit(e)}>
        <SearchSVG />
      </div>
      <input
        className={classes.searchInput}
        placeholder={"Search for events..."}
        onKeyDown={handleInputChange}
      ></input>
      {displayLoadingIcon && (name === "upcomingEvents" || !name) && (
        <div className={classes.loadingSvgContainer}>
          <LoadingSvg />
        </div>
      )}
      <div className={classes.countryCityFilter}>
        <CountrySelect
          getter={country}
          setter={setCountry}
          object={Object.values(isoCountries)}
          textValue={Object.keys(isoCountries)}
        />
        <>
          <div className={classes.spacer}>
            <h3>|</h3>
          </div>
          <CountrySelect
            getter={city}
            setter={setCity}
            object={Object.keys(bigCities[country] || {})}
            needsClose={true}
          />
        </>
      </div>
    </form>
  );
};

export default SearchInput;
