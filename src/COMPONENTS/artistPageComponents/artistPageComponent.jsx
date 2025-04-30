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

const useFetchData = (base_URL, bandName, specifiedSearchWithAPI) => {
  const [data, setData] = useState([]);
  const [secondaryData, setSecondaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bandName) {
      let isMounted = true;
      const url = `${base_URL}${encodeURIComponent(
        bandName
      )}${specifiedSearchWithAPI}`;

      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Failed to fetch artist");
          }

          const result = await response.json();

          setSecondaryData(result.results[0]);
          const firstArtist = result.results[0];
          const artistBio = await fetch(
            `https://api.discogs.com/artists/${firstArtist.id}`
          );
          const detailedData = await artistBio.json();

          if (isMounted) {
            setData(detailedData);
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

  return { data, secondaryData, loading, error };
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
  console.log(artist);

  const DISCOGS_API_KEY = import.meta.env.VITE_DISCOGS_API_KEY;
  const { data, secondaryData, loading, error } = useFetchData(
    "https://api.discogs.com/database/search?q=",
    artist.replace(/\+/g, " "),
    `&type=artist&token=${DISCOGS_API_KEY}`
  );
  console.log(data, secondaryData);

  return (
    <div className={classes.artistPage}>
      <div className={classes.artistName}>
        <h1>{data?.name}</h1>
        <img src={secondaryData?.cover_image} alt="" />
      </div>
    </div>
  );
};

export default ArtistPageComponent;
