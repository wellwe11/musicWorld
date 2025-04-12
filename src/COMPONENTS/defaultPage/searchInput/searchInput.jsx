import classes from "./searchInput.module.scss";
import { SearchSVG } from "./svg.jsx";

const SearchInput = () => {
  return (
    <div className={classes.searchInputContainer}>
      <div className={classes.searchIcon}>
        <SearchSVG />
      </div>
      <input
        className={classes.searchInput}
        placeholder="write something..."
      ></input>
    </div>
  );
};

export default SearchInput;
