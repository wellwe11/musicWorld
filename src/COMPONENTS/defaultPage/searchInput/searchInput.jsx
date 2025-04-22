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
            className={classes.countiesContainer}
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
            <button style={{ color: "gray" }} onClick={handleContainerClicked}>
              Select city...
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
  const clickTargetRef = useRef(null);

  const [input, setInput] = useState("");
  const [localPlaceholder, setLocalPlaceHolder] = useState("");

  // currently not needed, as component doesnt reaload unless countryMatch actually changes. But am keeping it here because I wanted to learn
  const countryMatch = useMemo(() => {
    return Object.entries(bigCities)?.find(([, obj]) =>
      Object.keys(obj)?.includes(input.toString("").toLowerCase())
    );
  }, [bigCities, input]);

  // const cityMatch = useMemo(() => {
  //   return Object.entries(bigCities)?.find(([, obj]) =>
  //   Object.keys(obj)?.includes(input.toString("").toLowerCase())
  //   )
  // })

  const artistNames = useCallback((name) => {
    events?.events?.map((event) => {
      event?._embedded?.attractions?.forEach((artist) => {
        if (artist?.name?.toLowerCase().includes(name.toLowerCase())) {
          console.log(artist);
          setArtist(artist.id);
          setLocalPlaceHolder(artist.name);
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

    // if user writes a string
    if (typeof input === "string" && input) {
      if (regionsNotCountries.includes(checkedInput)) {
        console.log("id needed, no ISO avaliable");
      }

      // if user writes country
      if (isoCountries[checkedInput]) {
        setCountry(isoCountries[checkedInput]);
        setInput("");
        setArtist("");
      }

      // if user writes city
      console.log(countryMatch);
      if (countryMatch && Object.keys(countryMatch[1]).includes(checkedInput)) {
        setCountry(countryMatch[0]);
        setCity(checkedInput);
        setArtist("");

        // if user writes
      } else if (countryMatch && typeof input === "string" && countryMatch[0]) {
        setCountry(countryMatch[0]);
        setCity("");
        setArtist("");
      }

      // if users input matches a genre
      if (musicGenres[checkedInput]) {
        setGenre(musicGenres[checkedInput]);
        setArtist("");
      } else {
        // looking for artists
        console.log("checking artist", input);
        setGenre("");
        artistNames(input);
        setInput("");
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
        handleNavigate("home/upcomingEvents");
      }}
    >
      <div className={classes.searchIcon}>
        <SearchSVG />
      </div>
      <input
        className={classes.searchInput}
        placeholder={localPlaceholder || "Search for events..."}
        onChange={handleInputChange}
        value={input}
      ></input>
      {localPlaceholder.length > 0 && input.length < 1 && (
        <button
          onMouseDown={() => {
            setInput("");
            setArtist("");
            setLocalPlaceHolder("");
          }}
        >
          X
        </button>
      )}
      {name === "upcomingEvents" && (
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
            needsClose={true}
          />
        </div>
      )}
    </form>
  );
};

export default SearchInput;
