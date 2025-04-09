import classes from "./searchInput.module.scss";

const SearchInput = () => {
  return (
    <div className={classes.searchInputContainer}>
      <input
        className={classes.searchInput}
        placeholder="write something..."
      ></input>
    </div>
  );
};

export default SearchInput;
