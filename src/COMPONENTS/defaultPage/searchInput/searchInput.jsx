import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";
import {
  isoCountries,
  regionsNotCountries,
  musicGenres,
  bigCities,
} from "./inputInformation.jsx";
import { useNavigate } from "react-router-dom";

const CountrySelect = ({ getter, setter, object }) => {
  const [containerClicked, setContainerClicked] = useState(false);
  const [localSetter, setLocalSetter] = useState();
  const mouseTarget = useRef(null);

  const handleContainerClicked = (e) => {
    if (e && e.nativeEvent.pointerType === "mouse") {
      const timeout = setTimeout(() => {
        containerClicked
          ? setContainerClicked(false)
          : setContainerClicked(true);
      }, 130);

      return () => clearTimeout(timeout);
    }
  };

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
    setLocalSetter(getter);
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
                  setLocalSetter(value);
                }}
                key={index}
              >
                {value}
              </button>
            ))}
          </div>
        )}
        {localSetter && localSetter.length > 1 ? (
          <button>
            {localSetter[0]}
            {localSetter[1]}
          </button>
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
      }

      if (bigCities[country][checkedInput]) {
        setCity(checkedInput);
      } else if (typeof input === "string" && countryMatch) {
        setCountry(countryMatch[0]);
        setCity(checkedInput);
      } else {
        console.log("check input");
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
      <div className={classes.countryCityFilter}>
        <CountrySelect
          getter={country}
          setter={setCountry}
          object={Object.values(isoCountries)}
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
      <input
        className={classes.searchInput}
        placeholder={`Search for events in ${
          Object.keys(isoCountries)[placeholderIndex]
        } ${", " + city + "..."}`}
        onChange={handleInputChange}
        value={input}
      ></input>
    </form>
  );
};

export default SearchInput;
