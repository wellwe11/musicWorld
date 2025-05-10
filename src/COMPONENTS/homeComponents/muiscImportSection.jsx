import { useEffect, useState } from "react";
import classes from "./homeComponent.module.scss";

import spotifyButton from "../artistPageComponents/media/spotify.png";
import soundcloudButton from "../artistPageComponents/media/soundcloud.png";
import youtubeButton from "../artistPageComponents/media/youtube.png";

const MediaSwitcher = () => {
  const [activeMediaImage, setActiveMediaImage] = useState(0);

  useEffect(() => {
    const imageCount = Object.keys(mediaImagesWithText).length;

    const timer = setTimeout(() => {
      activeMediaImage === imageCount - 1
        ? setActiveMediaImage(0)
        : setActiveMediaImage((prevNr) => prevNr + 1);
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeMediaImage]);

  const mediaImagesWithText = {
    spotify: {
      image: spotifyButton,
      name: "Spotify",
      color: "#1DB954",
    },

    soundcloud: {
      image: soundcloudButton,
      name: "Soundcloud",
      color: "#FF5500",
    },

    youtube: {
      image: youtubeButton,
      name: "YouTube",
      color: "#FF0000",
    },
  };

  return (
    <div className={classes.musicExploreWrapper}>
      <div className={classes.iconsContainer}>
        {Object.values(mediaImagesWithText).map((obj, index) => (
          <div className={classes.musicIconButton} key={index}>
            <button
              className={classes.musicIcon}
              style={{
                backgroundColor: `${obj.color}`,
              }}
            >
              <img className={classes.musicImage} src={obj.image} alt="" />
            </button>
          </div>
        ))}
      </div>
      <h4 className={classes.importAndExploreText}>
        Upload your favourite artists directly from{" "}
        <span
          style={{
            color: Object.values(mediaImagesWithText)[activeMediaImage].color,
          }}
        >
          {Object.values(mediaImagesWithText)[activeMediaImage].name}
        </span>
      </h4>
    </div>
  );
};

const MusicImportSection = () => {
  return (
    <div className={classes.musicImportContentContainer}>
      <div className={classes.musicImportContentWrapper}>
        <MediaSwitcher />
      </div>
    </div>
  );
};

export default MusicImportSection;
