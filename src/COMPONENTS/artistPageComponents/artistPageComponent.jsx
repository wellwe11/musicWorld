import { useEffect, useState } from "react";
import classes from "./artistPage.module.scss";
import { fetchDataTicketMaster } from "../../App";
import NavButton from "../defaultPage/navBar/navButton";

import starIcon from "../upcomingEventsPage/playIcons/star.png";

import facebookIcon from "./media/facebook.png";
import instagramIcon from "./media/instagram.png";
import twitterIcon from "./media/twitter.png";
import soundcloudIcon from "./media/soundcloud.png";
import youtubeIcon from "./media/youtube.png";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSvg from "./media/loadingSvg";

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
      instagram: findUrl(data?.urls, "instagram"),
      facebook: findUrl(data?.urls, "facebook"),
      twitter: findUrl(data?.urls, "twitter"),
      soundcloud: findUrl(data?.urls, "soundcloud"),
      youtube: findUrl(data?.urls, "youtube"),
    });
  }, [data, secondaryData]);

  const changeIsInterested = () =>
    isInterested ? setIsInterested(false) : setIsInterested(true);

  const artist = unfilteredEvents?.[0]?._embedded?.attractions?.[0];

  useEffect(() => {
    // if isInterested clicked and isn't in the interestedArtistsArray
    if (
      isInterested &&
      !interestedArtists?.some((e) => e.artist.id === artist?.id)
    ) {
      if (ticketMasterArtist._embedded) {
        setInterestedArtists((artists) => [
          ...artists,
          {
            artist: ticketMasterArtist?._embedded.attractions[0],
            event: unfilteredEvents.length > 0 ? unfilteredEvents[0] : "",
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
        artists.filter(
          (e) =>
            e?.artist.id !== ticketMasterArtist?._embedded.attractions[0].id
        )
      );
    }
  }, [isInterested]);

  useEffect(() => {
    if (ticketMasterArtist) {
      if (
        !interestedArtists?.some(
          (e) =>
            e?.artist.id === ticketMasterArtist?._embedded.attractions[0].id
        )
      ) {
        setIsInterested(false);
      }
      // sets true on-load if exists in array
      if (
        interestedArtists?.some(
          (e) =>
            e?.artist.id === ticketMasterArtist?._embedded.attractions[0].id
        )
      ) {
        setIsInterested(true);
      }
    }
  }, [ticketMasterArtist]);

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
              <NavButton externalClass={classes.interestedButton}>
                <p>Interested</p>
                <img
                  className={`${classes.interestedPlus} ${
                    !isInterested ? "" : classes.interestedPlusInterested
                  }`}
                  src={starIcon}
                  alt=""
                />
              </NavButton>
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

const ArtistEvents = ({ events, unfilteredEvents }) => {
  return (
    <div className={classes.artistEventsContainer}>
      {events?.length > 0 && (
        <div className={classes.eventSectionContainer}>
          <h2>
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
        {unfilteredEvents?.map((event, index) => (
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
    if (link) {
      const artistName = link.replace(/id/g, "");
      let updateName = artistName.replace(/[=]/g, " ");
      setArtist(updateName);
    }
    if (!artist && !link) {
      console.log("no artist active");
      handleNavigate("./home");
    }
  }, [artist, link]);

  // seperate fetch to display all upcoming events from artist
  const getEvents = async (artist) => {
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
      const onlyArtistEvents = displayOnlyArtistsEvents(fetchedData);
      setUnfilteredEvents(onlyArtistEvents);
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
    if (artist.length > 0) {
      const fetchedArtist = await fetchTicketMasterProfile(
        artist.replace(/ /g, "_")
      );

      if (fetchedArtist) {
        setTicketMasterArtist(fetchedArtist?._embedded?.attractions?.[0]);
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

  useEffect(() => {
    if (unfilteredEvents?.length > 0) {
      displayEventsInCurrentCountry();
    }
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
        setLocalLoading(false);
        setEventyInCountry(sortedByDate);
      }
    }
  };

  useEffect(() => {
    // get artists profile
    getTicketMasterArtist(artist);
  }, [artist]);

  useEffect(() => {
    if (ticketMasterArtist) {
      getEvents(artist);
    }
  }, [ticketMasterArtist]);

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
            unfilteredEvents={unfilteredEvents}
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
