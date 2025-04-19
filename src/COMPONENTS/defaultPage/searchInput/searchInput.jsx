import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";
import {
  isoCountries,
  regionsNotCountries,
  musicGenres,
  bigCities,
} from "./inputInformation.jsx";
import { useNavigate } from "react-router-dom";

const CountrySelect = ({ getter, setter, object, textValue }) => {
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
      }, 130);

      return () => clearTimeout(timeout);
    }
  };

  // Another timeout-event to distinguish between closing the container & mouseLeave the container
  const handleContainerClickedSlow = () => {
    const timeout = setTimeout(() => {
      containerClicked ? setContainerClicked(false) : setContainerClicked(true);
    }, 1050);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mouseTarget.current && !mouseTarget.current.contains(event.target)) {
        const timer = setTimeout(() => {
          handleContainerClicked();
        }, 250);
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerClicked]);

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

  return (
    <div className={classes.countrySelect}>
      <div onClick={(e) => handleContainerClicked(e)}>
        {containerClicked && (
          <div
            className={classes.countiesContainer}
            ref={mouseTarget}
            onMouseLeave={handleContainerClickedSlow}
          >
            {object.map((value, index) => (
              <button
                onClick={() => {
                  setter(value);
                  // not sure if I need this below anymore
                  // setLocalSetter(textValue ? textValue[index] : value);
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
          <button>{localSetter.replace(/_/g, " ")}</button>
        ) : (
          <button>{localSetter}</button>
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
  const [input, setInput] = useState("");
  let placeholderIndex = Object.values(isoCountries).indexOf(country);

  // currently not needed, as component doesnt reaload unless countryMatch actually changes. But am keeping it here because I wanted to learn
  const countryMatch = useMemo(() => {
    return Object.entries(bigCities)?.find(([, obj]) =>
      Object.keys(obj)?.includes(input.toString("").toLowerCase())
    );
  }, [bigCities, input]);

  const artistNames = useCallback((name) => {
    events?.events?.map((event) => {
      event?._embedded?.attractions?.forEach((artist) => {
        if (artist?.name?.toLowerCase().includes(name.toLowerCase())) {
          console.log(artist);
          setArtist(artist.id);
        }
      });
    });
  });

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let checkedInput = input.toString("").toLowerCase();

    if (!Number(input) && input) {
      if (regionsNotCountries.includes(checkedInput)) {
        console.log("id needed, no ISO avaliable");
      }

      if (isoCountries[checkedInput]) {
        setCountry(isoCountries[checkedInput]);
        setInput("");
        setCity("");
        setArtist("");
      }

      if (bigCities[country][checkedInput]) {
        setCity(checkedInput);
        setArtist("");
      } else if (typeof input === "string" && countryMatch) {
        setCountry(countryMatch[0]);
        setCity(checkedInput);
        setCity("");
        setArtist("");
      } else {
        console.log("checking artist", input);
        artistNames(input);
      }

      if (musicGenres[checkedInput]) {
        setGenre(musicGenres[checkedInput]);
      }

      setInput("");
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
      <div className={classes.searchIcon}>
        <SearchSVG />
      </div>
      <input
        className={classes.searchInput}
        placeholder={`Search in ${
          Object.keys(isoCountries)[placeholderIndex].charAt(0).toUpperCase() +
          Object.keys(isoCountries)[placeholderIndex].slice(1) +
          ", "
        } ${
          city.charAt(0).toUpperCase() +
          city.slice(1).replace(/_/g, " ") +
          "..."
        }`}
        onChange={handleInputChange}
        value={input}
      ></input>
      <div className={classes.countryCityFilter}>
        <CountrySelect
          getter={country}
          setter={setCountry}
          object={Object.values(isoCountries)}
          textValue={Object.keys(isoCountries)}
        />
        <div className={classes.spacer}>
          <h3>|</h3>{" "}
        </div>
        <CountrySelect
          getter={city}
          setter={setCity}
          object={Object.keys(bigCities[country])}
        />
      </div>
    </form>
  );
};

export default SearchInput;
