import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    console.log(containerClicked);
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
  setDateFrom,
  setDateTill,
  setGenre,
  country,
  setCountry,
  city,
  setCity,
  events,
  artist,
  setArtist,
}) => {
  const navigate = useNavigate();
  const { name } = useParams();

  const [input, setInput] = useState("");

  const countryMatch = useMemo(() => {
    return Object.entries(bigCities)?.find(([, obj]) =>
      Object.keys(obj)?.includes(input.toString("").toLowerCase())
    );
  }, [bigCities, input]);

  // currently dont need this
  // previously I would look THROUGH a previous fetch to see if it contains any artists
  // now I simply make a new fetch for specific artist
  // will keep if I need it anyway
  const artistNames = useCallback((name) => {
    events?.events?.map((event) => {
      event?._embedded?.attractions?.forEach((artist) => {
        if (artist?.name?.toLowerCase().includes(name.toLowerCase())) {
          console.log(artist);
          setArtist(artist.id);
          handleNavigate(`home/artistPage/id=${artist.id}`);
        } else {
          console.log("artist not found:", name);
        }
      });
    });
  });

  const handleInputChange = (e) => {
    if (e.key === "Enter") {
      console.log(e.target.value);
      setInput(e.target.value);
      e.target.value = "";
    }
  };

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let checkedInput = input.toString("").toLowerCase();

    // if user writes a string
    if (typeof input === "string" && input) {
      setInput("");

      if (regionsNotCountries.includes(checkedInput)) {
        console.log("id needed, no ISO avaliable");
      }

      console.log(checkedInput);
      console.log(isoCountries[checkedInput]);
      // if user writes country
      if (isoCountries[checkedInput]) {
        setCity("");
        return setCountry(isoCountries[checkedInput]);
      }

      if (country === isoCountries[checkedInput]) {
        return console.log(
          "you're searching for a country which is already searched for"
        );
      }

      // if user writes city
      if (countryMatch && Object.keys(countryMatch[1]).includes(checkedInput)) {
        setCountry(countryMatch[0]);
        // navigates to events to display events in city
        setCity(checkedInput);

        if (name !== "artistPage") {
          setArtist("");
          return handleNavigate("home/upcomingEvents");
        }

        return;

        // if user writes country but no ISO countries were initially found
      } else if (countryMatch && typeof input === "string" && countryMatch[0]) {
        console.log("setting country no city");
        setCity("");

        if (name !== "artistPage") {
          setArtist("");
        }

        return setCountry(countryMatch[0]);
      }

      // if users input matches a genre
      if (musicGenres[checkedInput]) {
        setGenre(musicGenres[checkedInput]);
        setArtist("");

        // display genre-events on eventpage
        return handleNavigate("home/upcomingEvents");
      } else {
        // looking for artists
        console.log("checking artist", checkedInput);

        let artistName = checkedInput.replace(/ /g, "+");
        setArtist(artistName);
        handleNavigate(`home/artistPage/id=${artistName}`);

        // artistNames(input);

        // reset genre becasue search is more specified
        setGenre("");

        // redirect to artistPage =>
        // on artist-page: display basic info about artist
        // then also display IF artist is playing in city/on date etc
        // if not, simply state it is not

        // if no artist is found =>
        // display "found no artist named 'checkedInput' :("
      }
    }

    // clean out items to determine if the input was a date
    let cleanedInput = input.replace(/[^0-9]/g, "");

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
      <div className={classes.countryCityFilter}>
        <CountrySelect
          getter={country}
          setter={setCountry}
          object={Object.values(isoCountries)}
          textValue={Object.keys(isoCountries)}
        />
        {name === "upcomingEvents" && (
          <>
            <div className={classes.spacer}>
              <h3>|</h3>
            </div>
            <CountrySelect
              getter={city}
              setter={setCity}
              object={Object.keys(bigCities[country])}
              needsClose={true}
            />
          </>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
