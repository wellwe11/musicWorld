import { useCallback, useEffect, useState } from "react";
import classes from "./artistPage.module.scss";
import { isoCountries } from "../defaultPage/searchInput/inputInformation";
import { fetchDataTicketMaster } from "../../App";

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

const ArtistProfile = ({ data, secondaryData }) => {
  const [artistName, setArtistName] = useState();
  const [imageSource, setImageSource] = useState();

  const [bioInfo, setBioInfo] = useState({});

  useEffect(() => {
    setArtistName(data?.name);
    setImageSource(secondaryData?.cover_image);

    setBioInfo({
      realName: data?.realname,
      info: data?.profile,
      instagram: data?.urls?.[1],
      facebook: data?.urls?.[2],
      twitter: data?.urls?.[6],
      soundcloud: data?.urls?.[3],
      youtube: data?.urls?.[8],
    });
  }, [data, secondaryData]);

  return (
    <div className={classes.artistProfile}>
      <div className={classes.profileContainer}>
        <div className={classes.titleContainer}>
          <h2>{artistName}</h2>
        </div>
        <div className={classes.imageContainer}>
          <img src={imageSource} alt="" />
        </div>
        <div className={classes.bioInfoContainer}>
          <h3>{bioInfo.realName}</h3>
          <h4>{bioInfo.info}</h4>
          <div className={classes.linkButtonsContainer}>
            <button onClick={() => window.open(bioInfo.instagram)}>
              Instagram
            </button>
            <button onClick={() => window.open(bioInfo.facebook)}>
              Facebook
            </button>
            <button onClick={() => window.open(bioInfo.twitter)}>
              Twitter
            </button>
            <button onClick={() => window.open(bioInfo.soundcloud)}>
              SoundCloud
            </button>
            <button onClick={() => window.open(bioInfo.youtube)}>
              YouTube
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtistEvents = ({
  events,
  city,
  country,
  dateFrom,
  dateTill,
  artist,
}) => {
  const [localEvents, setLocalEvents] = useState(null);
  const [unfilteredEvents, setUnfilteredEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  const getEvents = useCallback(async (artist) => {
    setLoading(true);
    const fetchedData = await fetchDataTicketMaster(
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      artist
    );
    if (fetchedData) {
      setUnfilteredEvents(fetchedData._embedded);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEvents(artist);
  }, [artist]);

  useEffect(() => {
    console.log(unfilteredEvents);
  }, [unfilteredEvents]);

  return (
    <div className={classes.artistEventsContainer}>
      <div>
        {unfilteredEvents?.events?.map((event) => (
          <div className={classes.eventWrapper}>
            <h4>{event?.name}</h4>
            <h5>{event?.dates?.start?.localDate}</h5>
            <h5>{event?._embedded?.venues?.[0]?.country?.name}</h5>
            <h5>{event?._embedded?.venues?.[0]?.city?.name}</h5>
          </div>
        ))}
      </div>
    </div>
  );
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
  const DISCOGS_API_KEY = import.meta.env.VITE_DISCOGS_API_KEY;
  const { data, secondaryData, loading, error } = useFetchData(
    "https://api.discogs.com/database/search?q=",
    artist.replace(/\+/g, " "),
    `&type=artist&token=${DISCOGS_API_KEY}`
  );

  return (
    <div className={classes.artistPage}>
      <ArtistEvents events={artistEvents} artist={artist} />
      <ArtistProfile data={data} secondaryData={secondaryData} />
    </div>
  );
};

export default ArtistPageComponent;
