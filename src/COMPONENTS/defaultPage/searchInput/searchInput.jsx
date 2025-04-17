import { useEffect, useState } from "react";
import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";
import {
  isoCountries,
  regionsNotCountries,
  musicGenres,
  bigCities,
} from "./inputInformation.jsx";

const CountrySelect = ({ getter, setter, object }) => {
  const [containerClicked, setContainerClicked] = useState(false);
  const [localSetter, setLocalSetter] = useState();

  const handleContainerClicked = () => {
    const timeout = setTimeout(() => {
      containerClicked ? setContainerClicked(false) : setContainerClicked(true);
    }, 300);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    setLocalSetter(getter);
  }, [getter]);

  return (
    <div className={classes.countrySelect}>
      <div onMouseDown={handleContainerClicked}>
        {containerClicked && (
          <div
            className={classes.countiesContainer}
            onMouseLeave={handleContainerClicked}
          >
            {object.map((value, index) => (
              <button
                onClick={() => {
                  setLocalSetter(value);
                  setter(value);
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
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Number(input) && input) {
      let checkedInput = input.toString("").toLowerCase();

      if (regionsNotCountries.includes(checkedInput)) {
        console.log("id needed, no ISO avaliable");
      }

      if (isoCountries[checkedInput]) {
        setCountry(isoCountries[checkedInput]);
        setInput("");
        setCity("");
      }

      if (bigCities[country][checkedInput]) {
        setCity(bigCities[country][checkedInput]);
      }

      if (musicGenres[checkedInput]) {
        setGenre(musicGenres[checkedInput]);
      }
    }

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
    <form className={classes.searchInputContainer} onSubmit={handleSubmit}>
      <div className={classes.searchIcon}>
        <SearchSVG />
      </div>
      <CountrySelect
        getter={country}
        setter={setCountry}
        object={Object.values(isoCountries)}
      />
      <CountrySelect
        getter={city}
        setter={setCity}
        object={Object.keys(bigCities[country])}
      />
      <input
        className={classes.searchInput}
        placeholder="write something..."
        onChange={handleInputChange}
        value={input}
      ></input>
    </form>
  );
};

export default SearchInput;
