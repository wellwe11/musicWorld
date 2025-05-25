import { useEffect, useState } from "react";
import classes from "./artistPage.module.scss";
import { fetchDataTicketMaster } from "../../App";

import starIcon from "../upcomingEventsPage/playIcons/star.png";
import facebookIcon from "./media/facebook.png";
import instagramIcon from "./media/instagram.png";
import twitterIcon from "./media/twitter.png";
import soundcloudIcon from "./media/soundcloud.png";
import youtubeIcon from "./media/youtube.png";
import ticketIcon from "./media/ticket.png";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSvg from "./media/loadingSvg";

const artistImages = {
  facebook: facebookIcon,
  instagram: instagramIcon,
  twitter: twitterIcon,
  soundcloud: soundcloudIcon,
  youtube: youtubeIcon,
};

const fetchTicketMasterProfile = async (artist) => {
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
  let url = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${ticketMasterApiKey}&keyword=${artist}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fetched failed");
    }

    const data = await response.json();

    return data || [];
  } catch (error) {
    console.error("fetch error", error);
    return [];
  }
};

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

const InterestedButton = ({ isInterested, changeIsInterested }) => {
  return (
    <div
      className={classes.interestedButtonContainer}
      onClick={changeIsInterested}
    >
      <button className={classes.interestedButton}>
        <img
          className={`${classes.interestedPlus} ${
            !isInterested ? "" : classes.interestedPlusInterested
          }`}
          src={starIcon}
          alt=""
        />
      </button>
    </div>
  );
};

const ArtistProfile = ({
  artistObject,
  data,
  secondaryData,
  interestedArtists,
  setInterestedArtists,
  unfilteredEvents,
  artistEvents,
  ticketMasterArtist,
  setTicketMasterArtist,
}) => {
  const [artistName, setArtistName] = useState();
  const [imageSource, setImageSource] = useState();
  const [isInterested, setIsInterested] = useState(null);

  const [bioInfo, setBioInfo] = useState({});

  useEffect(() => {
    setArtistName(data?.name);
    setImageSource(secondaryData?.cover_image);

    setBioInfo({
      realName: data?.realname,
      info: data?.profile,
      socials: {
        instagram: findUrl(data?.urls, "instagram"),
        facebook: findUrl(data?.urls, "facebook"),
        twitter: findUrl(data?.urls, "twitter"),
        soundcloud: findUrl(data?.urls, "soundcloud"),
        youtube: findUrl(data?.urls, "youtube"),
      },
    });
  }, [data, secondaryData]);

  const changeIsInterested = () =>
    isInterested ? setIsInterested(false) : setIsInterested(true);

  useEffect(() => {
    // if isInterested clicked and isn't in the interestedArtistsArray
    if (
      isInterested &&
      !interestedArtists?.some((e) => e.artist.id === ticketMasterArtist?.id)
    ) {
      if (ticketMasterArtist) {
        setInterestedArtists((artists) => [
          ...artists,
          {
            artist: ticketMasterArtist,
            event: unfilteredEvents?.length > 0 ? unfilteredEvents?.[0] : "",
            UpcomingEventsPage: artistEvents ? artistEvents : "",
          },
        ]);
      } else {
        console.log("No artist-profile on artist:", ticketMasterArtist);
      }
    }

    // filter away artists that have false
    if (isInterested === false && interestedArtists?.length > 0) {
      setInterestedArtists((artists) =>
        artists.filter((e) => e?.artist.id !== ticketMasterArtist?.id)
      );
    }
  }, [isInterested]);

  useEffect(() => {
    if (ticketMasterArtist) {
      if (
        !interestedArtists?.some((e) => e?.artist.id === ticketMasterArtist?.id)
      ) {
        setIsInterested(false);
      }
      // sets true on-load if exists in array
      if (
        interestedArtists?.some((e) => e?.artist.id === ticketMasterArtist?.id)
      ) {
        setIsInterested(true);
      }
    }
  }, [ticketMasterArtist]);

  return (
    <div className={classes.artistProfile}>
      <div className={classes.profileContainer}>
        <div className={classes.titleContainer}>
          <h2 className={classes.artistTitle}>{artistName}</h2>
        </div>

        <div className={classes.imageContainer}>
          <img src={imageSource} alt="" />
          <div className={classes.linkButtonsContainer}>
            <InterestedButton
              isInterested={isInterested}
              changeIsInterested={changeIsInterested}
            />
            {data && (
              <div className={classes.linkButtonContainer}>
                {Object.keys(bioInfo["socials"] || {}).map(
                  (social, index) =>
                    bioInfo["socials"][social] && (
                      <button
                        key={index}
                        onClick={() => window.open(bioInfo["socials"][social])}
                      >
                        <img src={artistImages[social]} alt="" />
                      </button>
                    )
                )}
              </div>
            )}
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

const ArtistEvents = ({ events, unfilteredEvents }) => {
  console.log(unfilteredEvents);
  return (
    <div className={classes.artistEventsContainer}>
      {events?.length > 0 && (
        <div className={classes.eventSectionContainer}>
          <h2 className={classes.eventsTitle}>
            Events in {events?.[0]?._embedded?.venues?.[0]?.country?.name}
          </h2>
          {events?.map((event, index) => (
            <div className={classes.eventWrapper} key={index}>
              <div className={classes.eventTitle}>
                <h4>{event?.name}</h4>
              </div>
              <div className={classes.eventSubInfo}>
                <h5>{event?.dates?.start?.localDate}</h5>
                <h5>{event?._embedded?.venues?.[0]?.country?.name}</h5>
                <h5>{event?._embedded?.venues?.[0]?.city?.name}</h5>
                <button
                  className={classes.ticketButton}
                  onClick={() => window.open(event?.url)}
                >
                  <div className={classes.whiteCoverHover}></div>
                  <img src={ticketIcon} alt="" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {unfilteredEvents?.length > 0 && (
        <div className={classes.eventSectionContainer}>
          <h2 className={classes.eventsTitle}>
            {events?.length > 0 ? "All other events" : "All events"}
          </h2>
          {unfilteredEvents?.map((event, index) => (
            <div className={classes.eventWrapper} key={index}>
              <div className={classes.eventTitle}>
                <h4>{event?.name}</h4>
              </div>
              <div className={classes.eventSubInfo}>
                <h5>{event?.dates?.start?.localDate}</h5>
                <h5>{event?._embedded?.venues?.[0]?.country?.name}</h5>
                <h5>{event?._embedded?.venues?.[0]?.city?.name}</h5>

                <button
                  className={classes.ticketButton}
                  onClick={() => window.open(event?.url)}
                >
                  <div className={classes.whiteCoverHover}></div>
                  <img src={ticketIcon} alt="" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ArtistPageComponent = ({
  country,
  artistEvents,
  setArtist,
  artist,
  interestedArtists,
  setInterestedArtists,
  eventsArray,
}) => {
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(true);
  const [unfilteredEvents, setUnfilteredEvents] = useState(null);
  const [eventsInCountry, setEventyInCountry] = useState(null);
  const [artistObject, setArtistObject] = useState(null);
  const [displayPage, setDisplayPage] = useState(false);
  const { link } = useParams();
  const [ticketMasterArtist, setTicketMasterArtist] = useState(null);
  const [countriesOutsideCountry, setCountriesOutsideCountry] = useState();

  const DISCOGS_API_KEY = import.meta.env.VITE_DISCOGS_API_KEY;
  const { data, secondaryData, loading, error } = useFetchData(
    "https://api.discogs.com/database/search?q=",
    artist,
    `&type=artist&token=${DISCOGS_API_KEY}`
  );

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  useEffect(() => {
    if (!artist && link) {
      const artistName = link.replace(/id/g, "");
      let updateName = artistName.replace(/[=]/g, " ");
      setArtist(updateName);
    }
    if (!artist && !link) {
      console.log("no artist active");
      handleNavigate("./home");
    }
  }, [link]);

  // seperate fetch to display all upcoming events from artist
  const getEvents = async (artist) => {
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
      const onlyArtistEvents = displayOnlyArtistsEvents(fetchedData);
      if (onlyArtistEvents) {
        setUnfilteredEvents(onlyArtistEvents);
      } else {
        setUnfilteredEvents([]);
      }

      console.log(onlyArtistEvents);
      if (!localLoading) {
        return setArtistObject(fetchedData);
      }
    }
  };

  // fetch ticket-master for specific artist.
  // This needs to be a lonely fetch, because I also need
  // the artists events which have already been fetched in App.
  // If we configure App-fetch to be the same as this fetch,
  // I wont get the artists events.. So I would have to locally
  // fetch artists-events, and in App fetch the artist, which
  // is essentially the same.
  const getTicketMasterArtist = async () => {
    setLocalLoading(true);
    if (artist.length > 0) {
      const fetchedArtist = await fetchTicketMasterProfile(
        artist.replace(/ /g, "_")
      );

      if (fetchedArtist) {
        const artistName = artist.trim().replace(/[+]/g, " ").toLowerCase();

        setLocalLoading(false);
        setTicketMasterArtist(
          fetchedArtist?._embedded?.attractions?.find(
            (e) => e?.name?.toLowerCase() === artistName
          )
        );
      }
    }
  };

  // filters out any events related to artist, but isn't done by the artist (many events are either misq. events or fan-made)
  const displayOnlyArtistsEvents = (fetchedData) => {
    let fixedEvents = fetchedData?._embedded?.events?.filter((ev) =>
      ev?._embedded?.attractions?.some((a) => a?.id === ticketMasterArtist?.id)
    );

    if (fixedEvents) {
      let sortedByDate = fixedEvents.sort(
        (a, b) =>
          new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate)
      );

      return sortedByDate;
    }
  };

  const displayEventsOutsideCountry = () => {
    const eventsOutsideCountry = unfilteredEvents?.filter(
      (ev) => ev?._embedded.venues[0].country.countryCode !== country
    );

    if (eventsOutsideCountry) {
      return setCountriesOutsideCountry(eventsOutsideCountry);
    }
  };

  useEffect(() => {
    displayEventsInCurrentCountry();
    displayEventsOutsideCountry();
  }, [unfilteredEvents]);

  const displayEventsInCurrentCountry = () => {
    const fixedEvents = unfilteredEvents?.filter(
      (ev) => ev?._embedded.venues[0].country.countryCode === country
    );

    if (fixedEvents) {
      let sortedByDate = fixedEvents.sort(
        (a, b) =>
          new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate)
      );

      if (sortedByDate) {
        setEventyInCountry(sortedByDate);
      }
    }
  };

  useEffect(() => {
    if (artist) {
      // get artists profile
      getTicketMasterArtist(artist);
    }
    console.log("asdasd:", ticketMasterArtist, artist);
  }, [artist, eventsArray]);

  useEffect(() => {
    if (ticketMasterArtist) {
      getEvents(artist);
    }
  }, [ticketMasterArtist, artist, country]);

  useEffect(() => {
    setDisplayPage(false);
    if (!localLoading) {
      const timer = setTimeout(() => {
        setDisplayPage(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [localLoading]);

  return (
    <div className={classes.artistPage}>
      {!displayPage && (
        <>
          <LoadingSvg />
        </>
      )}

      {displayPage && !error && (
        <>
          <ArtistEvents
            events={eventsInCountry}
            unfilteredEvents={countriesOutsideCountry}
          />
          {!localLoading && (
            <ArtistProfile
              artistObject={artistObject}
              data={data}
              secondaryData={secondaryData}
              interestedArtists={interestedArtists}
              setInterestedArtists={setInterestedArtists}
              unfilteredEvents={unfilteredEvents}
              artistEvents={eventsInCountry}
              ticketMasterArtist={ticketMasterArtist}
              setTicketMasterArtist={setTicketMasterArtist}
            />
          )}
        </>
      )}

      {displayPage && error && (
        <div className={classes.cantFindArtist}>
          <h1>
            Cant find {artist} {":("}
          </h1>
          <h3>Check if your search is correct</h3>
        </div>
      )}
    </div>
  );
};

export default ArtistPageComponent;
