import { useEffect, useState } from "react";
import classes from "./artistPage.module.scss";

const ArtistPageComponent = ({
  artistEvents,
  dateFrom,
  setDateFrom,
  dateTill,
  setDateTill,
  city,
  setCity,
  country,
  setCountry,
  artist,
}) => {
  const [localArtist, setLocalArtist] = useState(null);
  useEffect(() => {
    console.log(artistEvents, dateFrom, dateTill, city, country, artist);
    // array, null, null, DE, billie+eilish

    const artistName = artist.replace(/\+/g, " ");
    setLocalArtist(artistName);
  }, [artistEvents, dateFrom, dateTill, city, country, artist]);

  return (
    <div className={classes.artistPage}>
      <div className={classes.artistName}>
        <h1>{localArtist}</h1>
      </div>
    </div>
  );
};

export default ArtistPageComponent;
