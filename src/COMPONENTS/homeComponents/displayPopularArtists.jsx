import classes from "./homeComponent.module.scss";

const ArtistProfile = () => {
  return (
    <div className={classes.artistContainer}>
      <h2>Artist</h2>
    </div>
  );
};

const ArtistSection = ({ amount }) => {
  return (
    <div className={classes.artistsContainer}>
      {[...Array(amount)].map((artist, index) => (
        <ArtistProfile />
      ))}
    </div>
  );
};

const CenterSection = () => {
  return (
    <div className={classes.centerSection}>
      <div className={classes.circleContainer}>
        <div className={classes.circleContentContainer}>
          <p>Rock</p>
        </div>
        <div className={classes.circleContentContainer}>
          <p>Pop</p>
        </div>
        <div className={classes.circleContentContainer}>
          <p>Rap</p>
        </div>
        <div className={classes.circleContentContainer}>
          <p>Techno</p>
        </div>
      </div>
    </div>
  );
};

const SideSection = () => {
  return (
    <div className={classes.sideSectionContainer}>
      <div className={classes.sideSection}>
        <div className={classes.sideSectionArtists}>
          <ArtistSection amount={3} />
        </div>
      </div>
    </div>
  );
};

const LeftSection = () => {
  return (
    <div className={classes.leftSection}>
      <div className={classes.leftTop}>
        <SideSection />
      </div>
      <div className={classes.leftBottom}>
        <SideSection />
      </div>
    </div>
  );
};

const RightSection = () => {
  return (
    <div className={classes.rightSection}>
      <div className={classes.rightTop}>
        <SideSection />
      </div>
      <div className={classes.rightBottom}>
        <SideSection />
      </div>
    </div>
  );
};

const DisplayFamousArtistsComponent = () => {
  return (
    <div className={classes.displayFamousArtistsContainer}>
      <div>
        <h1>See whats currently trending</h1>
      </div>
      <div className={classes.displayFamousArtistsWrapper}>
        <div className={classes.artstSectionLeft}>
          <LeftSection />
        </div>
        <CenterSection />
        <div>
          <RightSection />
        </div>
      </div>
    </div>
  );
};

export default DisplayFamousArtistsComponent;
