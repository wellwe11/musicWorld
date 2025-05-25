import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, createContext, useCallback, useRef } from "react";

import classes from "../src/PAGES/defaultPage.module.scss";

import AccountPage from "./PAGES/account";
import AboutUsPage from "./PAGES/aboutUs";
import UpcomingEventsPage from "./PAGES/upcomingEvents";
import ArtistPage from "./PAGES/artistPage";

import NavBar from "./COMPONENTS/defaultPage/navBar/navBar";
import Footer from "./COMPONENTS/defaultPage/footer/footer";
import { bigCities } from "./COMPONENTS/defaultPage/searchInput/inputInformation";
import HomePage from "./PAGES/homePage";

import { addEvents } from "./PAGES/functions/eventsFilter";
import NavBarScroll from "./COMPONENTS/defaultPage/navBar/navBarScroll";
import LoadingSvg from "./COMPONENTS/artistPageComponents/media/loadingSvg";

export const EventContext = createContext();

// cache the API to avoid extra fetches
const ticketMasterCache = new Map();

export const fetchDataTicketMaster = async (
  size,
  page,
  dateStart,
  dateEnd,
  genre,
  country,
  city,
  artist
) => {
  let BASE_URL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music`;
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  let url = `${BASE_URL}&apikey=${ticketMasterApiKey}&size=200`;
  console.log(dateStart, dateEnd, genre, country, city, artist);
  if (artist) {
    url += `&keyword=${artist.trim()}`;

    if (country) {
      url += `&countryCode=${country}`;
    }
  }

  if (!artist) {
    if (dateStart) {
      url += `&startDateTime=${dateStart}T00:00:00Z`;
    }

    if (dateEnd) {
      url += `&endDateTime=${dateEnd}T23:59:59Z`;
    }

    if (genre) {
      url += `&genreId=${genre}`;
    }

    if (country) {
      url += `&countryCode=${country}`;
    }

    if (city) {
      url += `&city=${city}`;
    }
  }

  if (ticketMasterCache.has(url)) {
    console.log("Same api-fetch as previously:", url);
    return ticketMasterCache.get(url);
  }

  console.log(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fetched failed");
    }

    const data = await response.json();

    ticketMasterCache.set(url, data);
    console.log(data);

    return data || [];
  } catch (error) {
    console.error("fetch error", error);
    return [];
  }
};

const App = () => {
  const { home, name, link } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTill, setDateTill] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("DE");
  // const [city, setCity] = useState(Object.keys(bigCities[country])[0]);
  const [city, setCity] = useState("");
  const [artist, setArtist] = useState("");
  // a new array containing filtered events to avoid duplicates
  const [eventsArray, setEventsArray] = useState([]);
  const [interestedArtists, setInterestedArtists] = useState([]);

  const titleRef = useRef();
  const [displayFixedNavBar, setDisplayFixedNavBar] = useState(false);

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
    artistPage: ArtistPage,
  };

  const PageToView = namePage[name];

  const navigate = useNavigate();

  const handleNavigate = (link) => {
    navigate(`/${link}/`);
  };

  const getEvents = useCallback(
    async (size, page, dateStart, dateEnd, genre, country, city) => {
      setLoading(true);

      const fetchedData = await fetchDataTicketMaster(
        size,
        page,
        dateStart,
        dateEnd,
        genre,
        country,
        city,
        ""
      );
      if (fetchedData) {
        setEvents(fetchedData._embedded);
        setLoading(false);
      }
    },
    []
  );

  const fetchEvents = () => {
    if (name !== "artistPage") {
      if (dateFrom || dateTill || genre || country || city) {
        getEvents("", "", dateFrom, dateTill, genre, country, city, "");
      } else {
        getEvents();
      }
    }
  };

  useEffect(() => {
    if (!name) {
      setDateFrom("");
      setDateTill("");
      setGenre("");
      setCity("");
    }

    window.scrollTo(0, 0);
  }, [name]);

  useEffect(() => {
    if (artist) {
      setDateFrom("");
      setDateTill("");
      setGenre("");
      setCity("");
    }

    if (country) {
      fetchEvents();
      return;
    }

    if (name !== "artistPage") {
      setArtist("");
      return fetchEvents();
    }
  }, [dateFrom, dateTill, genre, city, country, name]);

  // once events are fetched, filter the events
  useEffect(() => {
    if (events) {
      return addEvents(events?.events, setEventsArray);
    } else {
      setEventsArray([]);
    }
  }, [events]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) setDisplayFixedNavBar(true);
          if (entry.isIntersecting) setDisplayFixedNavBar(false);
        });
      },
      {
        threshold: 0.1,
      }
    );

    const target = titleRef.current;

    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  return (
    <div className={classes.appContainer}>
      {/* <div ref={titleRef} className={classes.titleRefContainer}>
        </div> */}
      <NavBar
        setDateFrom={setDateFrom}
        setDateTill={setDateTill}
        dateFrom={dateFrom}
        dateTill={dateTill}
        genre={genre}
        setGenre={setGenre}
        country={country}
        setCountry={setCountry}
        city={city}
        setCity={setCity}
        artist={artist}
        setArtist={setArtist}
        events={events}
      />
      {/* {displayFixedNavBar && (
        <NavBarScroll
          setDateFrom={setDateFrom}
          setDateTill={setDateTill}
          dateFrom={dateFrom}
          dateTill={dateTill}
          genre={genre}
          setGenre={setGenre}
          country={country}
          setCountry={setCountry}
          city={city}
          setCity={setCity}
          artist={artist}
          setArtist={setArtist}
          events={events}
        />
      )} */}
      {eventsArray ? (
        <>
          <div className={classes.routesContainer}>
            {name === "artistPage" && link ? (
              <ArtistPage
                artistEvents={events}
                eventsArray={eventsArray}
                interestedArtists={interestedArtists}
                setInterestedArtists={setInterestedArtists}
                artist={artist}
                setArtist={setArtist}
                country={country}
              />
            ) : name && !link ? (
              <PageToView
                city={city}
                country={country}
                dateFrom={dateFrom}
                eventsArray={eventsArray}
                interestedArtists={interestedArtists}
                setInterestedArtists={setInterestedArtists}
                loading={loading}
                setArtist={setArtist}
              />
            ) : (
              <HomePage
                eventsArray={eventsArray}
                interestedArtists={interestedArtists}
                setInterestedArtists={setInterestedArtists}
                country={country}
                setDateFrom={setDateFrom}
                setDateTill={setDateTill}
                setArtist={setArtist}
              />
            )}
          </div>
        </>
      ) : (
        <LoadingSvg />
      )}

      <Footer />
    </div>
  );
};

export default App;

// to read for tomorrow:

/**
 * todos:
 *
 * BUGS:
 * SOME artists appear laggy when hovering in following artists
 *
 *
 * Ellies projects:
 * - ellie fixes logo with mery to fit font
 * Connect to youtube/spotify/soundcloud apps appear laggy when hovering
 * remove scroll-bars on account-page
 */

/** extras
 *
 * Design app-section on homePage
 * When searching for artists: Display an array of several artists as options (in-case correct artist does not appear)
 * -- Let user select correct artist
 * -- If no image/info is displayeable from discogs, use a fallback image
 *
 * home-page section that contains "Search your favorite blablabla (filter items)"
 * -- Create new section that has todays "genre" and will display artists within those genres
 * --- Currently displaying artists around the genre, make it so genre is on top and artists are below (this simplifies the structure if there is a lack of artists)
 *
 *
 */
