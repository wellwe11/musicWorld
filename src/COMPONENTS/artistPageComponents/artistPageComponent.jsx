import { useCallback, useEffect, useState } from "react";
import classes from "./artistPage.module.scss";
import { isoCountries } from "../defaultPage/searchInput/inputInformation";
import { fetchDataTicketMaster } from "../../App";
import NavButton from "../defaultPage/navBar/navButton";

import buttonClickPlus from "../homeComponents/images/plus.png";
import buttonClickClose from "../../COMPONENTS/defaultPage/searchInput/close.png";

import facebookIcon from "./media/facebook.png";
import instagramIcon from "./media/instagram.png";
import twitterIcon from "./media/twitter.png";
import soundcloudIcon from "./media/soundcloud.png";
import youtubeIcon from "./media/youtube.png";
import { useNavigate } from "react-router-dom";

export const useFetchData = (base_URL, bandName, specifiedSearchWithAPI) => {
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

// use to match social-media links to correct links. They're un-ordered in the fetch, so you need a dynamic fetch, rather than directly accessing the object containing the links
const findUrl = (urls, keyword) => {
  if (urls) {
    const matchingUrl = urls.find((url) => url.includes(keyword));

    if (matchingUrl) {
      return matchingUrl;
    } else {
      return console.log("No matching social media-link");
    }
  }
};

const ArtistProfile = ({
  artistObject,
  data,
  secondaryData,
  interestedArtists,
  setInterestedArtists,
}) => {
  const [artistName, setArtistName] = useState();
  const [imageSource, setImageSource] = useState();
  const [isInterested, setIsInterested] = useState(null);

  const [bioInfo, setBioInfo] = useState({});

  console.log(
    "artistObject:",
    artistObject,
    "data:",
    data,
    "secondaryData:",
    secondaryData
  );

  useEffect(() => {
    setArtistName(data?.name);
    setImageSource(secondaryData?.cover_image);

    setBioInfo({
      realName: data?.realname,
      info: data?.profile,
      instagram: findUrl(data?.urls, "instagram"),
      facebook: findUrl(data?.urls, "facebook"),
      twitter: findUrl(data?.urls, "twitter"),
      soundcloud: findUrl(data?.urls, "soundcloud"),
      youtube: findUrl(data?.urls, "youtube"),
    });
  }, [data, secondaryData]);

  const changeIsInterested = () =>
    isInterested ? setIsInterested(false) : setIsInterested(true);

  useEffect(() => {
    if (isInterested && !interestedArtists?.some((e) => e === artistObject)) {
      setInterestedArtists((artists) => [...artists, artistObject]);
    }

    if (isInterested === false && interestedArtists?.length > 0) {
      setInterestedArtists((artists) =>
        artists.filter((artist) => artist !== artistObject)
      );
    }
  }, [isInterested]);

  useEffect(() => {
    // sets true on-load if exists in array
    if (interestedArtists?.some((e) => e === artistObject)) {
      setIsInterested(true);
    }

    if (!interestedArtists?.some((e) => e === artistObject)) {
      setIsInterested(false);
    }
  }, [interestedArtists]);

  return (
    <div className={classes.artistProfile}>
      <div className={classes.profileContainer}>
        <div className={classes.titleContainer}>
          <h2>{artistName}</h2>
        </div>

        <div className={classes.imageContainer}>
          <img src={imageSource} alt="" />
          <div className={classes.linkButtonsContainer}>
            <div
              className={classes.interestedButtonContainer}
              onClick={changeIsInterested}
            >
              {!isInterested ? (
                <NavButton
                  externalClass={classes.interestedButtonNotInterested}
                >
                  Interested
                  <img
                    className={classes.interestedPlus}
                    src={buttonClickPlus}
                    alt=""
                  />
                </NavButton>
              ) : (
                <NavButton externalClass={classes.interestedButtonInterested}>
                  Interested
                  <img
                    className={classes.interestedPlus}
                    src={buttonClickClose}
                    alt=""
                  />
                </NavButton>
              )}
            </div>
            <div className={classes.linkButtonContainer}>
              <button onClick={() => window.open(bioInfo.instagram)}>
                <img src={instagramIcon} alt="" />
              </button>
              <button onClick={() => window.open(bioInfo.facebook)}>
                <img src={facebookIcon} alt="" />
              </button>
              <button onClick={() => window.open(bioInfo.twitter)}>
                <img src={twitterIcon} alt="" />
              </button>
              <button onClick={() => window.open(bioInfo.soundcloud)}>
                <img src={soundcloudIcon} alt="" />
              </button>
              <button onClick={() => window.open(bioInfo.youtube)}>
                <img src={youtubeIcon} alt="" />
              </button>
            </div>
          </div>
        </div>
        <div className={classes.bioInfoContainer}>
          <h3>{bioInfo.realName}</h3>
          <h4>{bioInfo.info}</h4>
        </div>
      </div>
    </div>
  );
};

const ArtistEvents = ({ events, unfilteredEvents, loading }) => {
  return (
    <div className={classes.artistEventsContainer}>
      {events && (
        <div className={classes.eventSectionContainer}>
          <h2>
            Events in{" "}
            {events?.events?.[0]?._embedded?.venues?.[0]?.country?.name}
          </h2>
          {events?.events?.map((event, index) => (
            <div className={classes.eventWrapper} key={index}>
              <div className={classes.eventTitle}>
                <h4>{event?.name}</h4>
              </div>
              <div className={classes.eventSubInfo}>
                <h5>{event?.dates?.start?.localDate}</h5>
                <h5>{event?._embedded?.venues?.[0]?.country?.name}</h5>
                <h5>{event?._embedded?.venues?.[0]?.city?.name}</h5>
                <NavButton onClick={() => window.open(event?.url)}>
                  Ticket
                </NavButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={classes.eventSectionContainer}>
        <h2>All events</h2>
        {unfilteredEvents?.events?.map((event, index) => (
          <div className={classes.eventWrapper} key={index}>
            <div className={classes.eventTitle}>
              <h4>{event?.name}</h4>
            </div>
            <div className={classes.eventSubInfo}>
              <h5>{event?.dates?.start?.localDate}</h5>
              <h5>{event?._embedded?.venues?.[0]?.country?.name}</h5>
              <h5>{event?._embedded?.venues?.[0]?.city?.name}</h5>

              <NavButton onClick={() => window.open(event?.url)}>
                Ticket
              </NavButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArtistPageComponent = ({
  artistEvents,
  artist,
  interestedArtists,
  setInterestedArtists,
}) => {
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(true);
  const [unfilteredEvents, setUnfilteredEvents] = useState(null);
  const [artistObject, setArtistObject] = useState(null);

  const DISCOGS_API_KEY = import.meta.env.VITE_DISCOGS_API_KEY;
  const { data, secondaryData, loading, error } = useFetchData(
    "https://api.discogs.com/database/search?q=",
    artist.replace(/\+/g, " "),
    `&type=artist&token=${DISCOGS_API_KEY}`
  );

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  useEffect(() => {
    if (!artist) {
      console.log("no artist active");
      handleNavigate("./home");
    }
  }, [artist]);

  // seperate fetch to display all upcoming events from artist
  const getEvents = useCallback(async (artist) => {
    setLocalLoading(true);
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
      setArtistObject(fetchedData);
      console.log(fetchedData);
      setLocalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (artist) {
      getEvents(artist);
    }
  }, [artist]);

  return (
    <div className={classes.artistPage}>
      <ArtistEvents
        events={artistEvents}
        artist={artist}
        unfilteredEvents={unfilteredEvents}
      />
      <ArtistProfile
        artistObject={artistObject}
        data={data}
        secondaryData={secondaryData}
        interestedArtists={interestedArtists}
        setInterestedArtists={setInterestedArtists}
      />
    </div>
  );
};

export default ArtistPageComponent;
