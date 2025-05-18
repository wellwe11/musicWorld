import { useEffect, useState } from "react";
import classes from "./homeComponent.module.scss";

import {
  musicGenres,
  musicGenresWithSubGenres,
} from "../defaultPage/searchInput/inputInformation";

const ArtistProfile = ({ displayArtist }) => {
  return (
    <div
      className={classes.artistContainer}
      style={{ opacity: displayArtist ? "1" : "0" }}
    >
      <h2>Artist</h2>
    </div>
  );
};

const ArtistSection = ({ amount, isHovering }) => {
  const [displayArtist, setDisplayArtist] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if ((isHovering && !hasStarted) || (hasStarted && displayArtist < amount)) {
      if (!hasStarted) setHasStarted(true);

      const timer = setTimeout(() => {
        setDisplayArtist((prev) => prev + 1);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isHovering, displayArtist, hasStarted, amount]);

  return (
    <div className={classes.artistsContainer}>
      {[...Array(amount)].map((artist, index) => (
        <ArtistProfile key={index} displayArtist={index < displayArtist} />
      ))}
    </div>
  );
};

const CenterGenreButton = ({ activeGenre, setActiveGenre, genreOptions }) => {
  const handleGenreChange = (e) => {
    setActiveGenre(e.target.value);
  };

  return (
    <div className={classes.genreList}>
      <select value={genreOptions} onChange={handleGenreChange}>
        <option value="">{activeGenre ? activeGenre : "Select Genre"}</option>
        {genreOptions.map((genre) => (
          <option key={genre} value={genre}>
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

const CenterSection = ({
  setIsHovering,
  activeGenre,
  setActiveGenre,
  genreOptions,
  subGenres,
}) => {
  return (
    <div className={classes.centerSection}>
      <CenterGenreButton
        activeGenre={activeGenre}
        setActiveGenre={setActiveGenre}
        genreOptions={genreOptions}
      />
      <div className={classes.circleContainer}>
        {subGenres.map(([sGenre], index) => (
          <div
            className={classes.circleContentContainer}
            onMouseEnter={() => setIsHovering((prevN) => [...prevN, index + 1])}
          >
            <p>{sGenre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SideSection = ({ isHovering }) => {
  return (
    <div className={classes.sideSectionContainer}>
      <div className={classes.sideSection}>
        <div className={classes.sideSectionArtists}>
          <ArtistSection amount={3} isHovering={isHovering} />
        </div>
      </div>
    </div>
  );
};

const LeftSection = ({ isHovering }) => {
  return (
    <div className={classes.leftSection}>
      <div className={`${classes.leftTop}`}>
        <SideSection isHovering={isHovering.some((n) => n === 3)} />
      </div>
      <div className={classes.leftBottom}>
        <SideSection isHovering={isHovering.some((n) => n === 1)} />
      </div>
    </div>
  );
};

const RightSection = ({ isHovering }) => {
  return (
    <div className={classes.rightSection}>
      <div className={classes.rightTop}>
        <SideSection isHovering={isHovering.some((n) => n === 4)} />
      </div>
      <div className={classes.rightBottom}>
        <SideSection isHovering={isHovering.some((n) => n === 2)} />
      </div>
    </div>
  );
};

const DisplayFamousArtistsComponent = () => {
  const [isHovering, setIsHovering] = useState([]);
  const [activeGenre, setActiveGenre] = useState("");

  const genreOptions = Object.keys(musicGenresWithSubGenres);
  const subGenreOptions =
    activeGenre && musicGenresWithSubGenres[activeGenre]?.subgenres
      ? Object.entries(musicGenresWithSubGenres[activeGenre].subgenres)
      : [];

  console.log(isHovering);

  return (
    <div className={classes.displayFamousArtistsContainer}>
      <div>
        <h1>See whats currently trending</h1>
      </div>
      <div className={classes.displayFamousArtistsWrapper}>
        <div className={classes.artstSectionLeft}>
          <LeftSection isHovering={isHovering} />
        </div>
        <CenterSection
          setIsHovering={setIsHovering}
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
          genreOptions={genreOptions}
          subGenres={subGenreOptions}
        />
        <div>
          <RightSection isHovering={isHovering} />
        </div>
      </div>
    </div>
  );
};

export default DisplayFamousArtistsComponent;
