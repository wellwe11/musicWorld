import { useEffect } from "react";

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
}) => {
  useEffect(() => {
    console.log(artistEvents);
  }, [artistEvents]);
  return (
    <div>
      <h1>Artist name</h1>
    </div>
  );
};

export default ArtistPage;
