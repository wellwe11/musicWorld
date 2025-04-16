import { useEffect, useState } from "react";
import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";
import {
  isoCountries,
  regionsNotCountries,
  musicGenres,
} from "./inputInformation.jsx";

const SearchInput = () => {
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
      }

      if (musicGenres[checkedInput]) {
        console.log(musicGenres[checkedInput]);
      }

      console.log(checkedInput);
    }

    let cleanedInput = input.replace(/[^0-9]/g, "");

    if (cleanedInput && Number(cleanedInput)) {
      const date = new Date(`${input}`);
      let formattedDate = date.toUTCString();
      console.log(formattedDate);
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
