import classes from "./searchInput.module.scss";

const SearchInput = () => {
  return (
    <div className={classes.searchInputContainer}>
      <input placeholder="write something..."></input>
    </div>
  );
};

export default SearchInput;
