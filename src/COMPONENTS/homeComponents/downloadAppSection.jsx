import classes from "./homeComponent.module.scss";

import spotifyOnPhone from "./images/spotifyOnPhoneImage.webp";
import phoneImage from "./images/phoneImage.png";

import worldCloudImage from "./images/wordcloud_image.png";

import logoImage from "../defaultPage/navBar/images/logoImage.png";

const FindAppSection = () => {
  return (
    <div className={classes.findAppSectionContainer}>
      <div className={classes.phoneContainer}>
        <img className={classes.phoneImage} src={phoneImage} alt="" />
        <div className={classes.insidePhone}>
          <div className={classes.contentContainer}>
            <div className={classes.logoContainer}>
              <img className={classes.logoImage} src={logoImage} alt="" />
            </div>
            <h5 className={classes.downloadText}>Download our app</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindAppSection;
