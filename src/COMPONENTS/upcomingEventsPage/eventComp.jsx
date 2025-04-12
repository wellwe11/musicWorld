import { useEffect, useRef, useState } from "react";
import classes from "./upcomingEvents.module.scss";

const Event = ({ title, date, image, country, city, artists }) => {
  const [artistNames, setArtistNames] = useState([]);

  useEffect(() => {
    if (artists > 0) {
      artists.map((artist) => {
        setArtistNames((prevNames) => [...prevNames, artist.name]);
      });
    } else {
      setArtistNames(artists);
    }
  }, [artists]);

  console.log(artistNames);

  return (
    <div className={classes.event}>
      <h1>{title}</h1>
      <img src={image.url} alt="" />
      <div className={classes.subInfo}>
        <h4>{date}</h4>
        <h5>
          {country} - {city}
        </h5>
        <div>
          {/* {artistNames[0] > 0 ? (
            artistNames[0].map((artist) => <h5>{artist.name}</h5>)
          ) : (
            <h5>{artistNames[0]}</h5>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Event;
