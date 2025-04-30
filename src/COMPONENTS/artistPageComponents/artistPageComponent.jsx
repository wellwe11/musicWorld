import { useEffect, useState } from "react";
import classes from "./artistPage.module.scss";
import { isoCountries } from "../defaultPage/searchInput/inputInformation";

//   const getEvents = useCallback(
//     async (size, page, dateStart, dateEnd, genre, country, city, artist) => {
//       setLoading(true);
//       const fetchedData = await fetchDataTicketMaster(
//         size,
//         page,
//         dateStart,
//         dateEnd,
//         genre,
//         country,
//         city,
//         artist
//       );
//       if (fetchedData) {
//         setEvents(fetchedData._embedded);
//         setLoading(false);
//       }
//     },
//     []
//   );

const useFetchData = (bandName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const base_URL = `https://api.discogs.com/database/search?`;
  const DISCOGS_API_KEY = import.meta.env.VITE_DISCOGS_API_KEY;

  useEffect(() => {
    if (bandName) {
      let isMounted = true;
      const url = `${base_URL}q=${encodeURIComponent(
        bandName
      )}&type=artist&token=${DISCOGS_API_KEY}`;

      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Failed to fetch artist");
          }

          const result = await response.json();
          if (isMounted) {
            setData(result);
            setLoading(false);
          }
        } catch (error) {
          if (isMounted) {
            console.error("artist fetch failed", error);
            setError(error);
            setLoading(false);
          }
        }
      };

      fetchData();
      return () => {
        isMounted = false;
      };
    }
  }, [bandName]);

  return { data, loading, error };
};

const ArtistName = ({}) => {
  return <div className={classes.artistName}></div>;
};

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
  const [localCountry, setLocalCountry] = useState(null);
  useEffect(() => {
    // array, null, null, DE, billie+eilish

    const countryName = Object.keys(isoCountries).find(
      (key) => isoCountries[key] === country
    );
    const fixedCountryName =
      countryName.charAt(0).toUpperCase() + countryName.slice(1);

    setLocalCountry(fixedCountryName);

    const artistName = artist.replace(/\+/g, " ");
    setLocalArtist(artistName);
  }, [artistEvents, dateFrom, dateTill, city, country, artist]);
  const { data, loading, error } = useFetchData(localArtist);
  console.log(data?.results?.[0]);

  return (
    <div className={classes.artistPage}>
      <div className={classes.artistName}>
        <h1>{localArtist}</h1>
        <h3>{localCountry}</h3>
      </div>
    </div>
  );
};

export default ArtistPageComponent;
