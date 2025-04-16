import { useEffect, useState } from "react";
import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";
import {
  isoCountries,
  regionsNotCountries,
  musicGenres,
} from "./inputInformation.jsx";

const SearchInput = ({ setDateFrom, setDateTill, setGenre, setCountry }) => {
  const [input, setInput] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(input);

    if (!Number(input)) {
      let checkedInput = input.toString("").toLowerCase();

      if (regionsNotCountries.includes(checkedInput)) {
        console.log("id needed, no ISO avaliable");
      }

      if (isoCountries[checkedInput]) {
        console.log(isoCountries[checkedInput]);
        setCountry(isoCountries[checkedInput]);
      }

      if (musicGenres[checkedInput]) {
        console.log(musicGenres[checkedInput]);
        setGenre(musicGenres[checkedInput]);
      }

      console.log(checkedInput);
    }

    let cleanedInput = input.replace(/[^0-9]/g, "");

    if (cleanedInput && Number(cleanedInput)) {
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
      <input
        className={classes.searchInput}
        placeholder="write something..."
        onChange={handleInputChange}
      ></input>
    </form>
  );
};

export default SearchInput;
