import { useEffect } from "react";
import ArtistPageComponent from "../COMPONENTS/artistPageComponents/artistPageComponent";

const ArtistPage = ({
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
  return (
    <ArtistPageComponent
      artistEvents={artistEvents}
      dateFrom={dateFrom}
      setDateFrom={setDateFrom}
      dateTill={dateTill}
      setDateTill={setDateTill}
      city={city}
      setCity={setCity}
      country={country}
      setCountry={setCountry}
      artist={artist}
    />
  );
};

export default ArtistPage;
