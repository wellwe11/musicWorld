import { useEffect, useState } from "react";
import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";
import {
  isoCountries,
  regionsNotCountries,
  musicGenres,
  bigCities,
} from "./inputInformation.jsx";

const CountrySelect = ({ country, setCountry }) => {
  const [containerClicked, setContainerClicked] = useState(false);
  const [countryISO, setCountryISO] = useState();

  const handleContainerClicked = () => {
    const timeout = setTimeout(() => {
      containerClicked ? setContainerClicked(false) : setContainerClicked(true);
    }, 300);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    setCountryISO(country);
  }, [country]);

  return (
    <div className={classes.countrySelect}>
      <div onMouseDown={handleContainerClicked}>
        {containerClicked && (
          <div
            className={classes.countiesContainer}
            onMouseLeave={handleContainerClicked}
          >
            {Object.values(isoCountries).map((country, index) => (
              <button
                onClick={() => {
                  setCountryISO(country);
                  setCountry(country);
                }}
                key={index}
              >
                {country}
              </button>
            ))}
          </div>
        )}
        <button>{countryISO}</button>
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
        console.log(isoCountries[checkedInput]);
        setCountry(isoCountries[checkedInput]);
        setInput("");
        setCity("");
      }

      if (bigCities[country][checkedInput]) {
        setCity(bigCities[country][checkedInput]);
      }

      if (musicGenres[checkedInput]) {
        console.log(musicGenres[checkedInput]);
        setGenre(musicGenres[checkedInput]);
      }

      console.log(checkedInput);
    }

    let cleanedInput;

    if (cleanedInput && Number(cleanedInput)) {
      cleanedInput = input.replace(/[^0-9]/g, "");
      const date = new Date(`${input}`);
      const tillDate = new Date(new Date(date).setMonth(date.getMonth() + 2));
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

      console.log(formattedDate, formattedTillDate);
      setDateFrom(formattedDate);
      setDateTill(formattedTillDate);
    }
  };

  return (
    <form className={classes.searchInputContainer} onSubmit={handleSubmit}>
      <div className={classes.searchIcon}>
        <SearchSVG />
      </div>
      <CountrySelect setCountry={setCountry} country={country} />
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
