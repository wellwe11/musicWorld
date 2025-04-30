import { useParams, Link } from "react-router-dom";
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

export const EventContext = createContext();

const fetchDataTicketMaster = async (
  size,
  page,
  dateStart,
  dateEnd,
  genre,
  country,
  city,
  artist
) => {
  const BASE_URL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music`;
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  let url = `${BASE_URL}&apikey=${ticketMasterApiKey}&size=200`;

  if (dateStart && dateEnd) {
    url += `&startDateTime=${dateStart}T00:00:00Z&endDateTime=${dateEnd}T23:59:59Z`;
  }

  if (artist) {
    url = `${BASE_URL}&apikey=${ticketMasterApiKey}&size=25&page=0&keyword=${artist}`;

    if (city) {
      url += `&city=${city}`;
    }
  }

  if (!artist) {
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

const App = () => {
  const { home, name, link } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTill, setDateTill] = useState(null);
  const [genre, setGenre] = useState(null);
  const [country, setCountry] = useState("DE");
  // const [city, setCity] = useState(Object.keys(bigCities[country])[0]);
  const [city, setCity] = useState("");
  const [artist, setArtist] = useState("");
  // a new array containing filtered events to avoid duplicates
  const [eventsArray, setEventsArray] = useState([]);

  const titleRef = useRef();
  const [displayFixedNavBar, setDisplayFixedNavBar] = useState(false);

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
    artistPage: ArtistPage,
  };

  const PageToView = namePage[name];

  const getEvents = useCallback(
    async (size, page, dateStart, dateEnd, genre, country, city, artist) => {
      setLoading(true);
      const fetchedData = await fetchDataTicketMaster(
        size,
        page,
        dateStart,
        dateEnd,
        genre,
        country,
        city,
        artist
      );
      if (fetchedData) {
        setEvents(fetchedData._embedded);
        setLoading(false);
      }
    },
    []
  );

  const fetchEvents = () => {
    if (dateFrom || dateTill || genre || country || city || artist) {
      getEvents("", "", dateFrom, dateTill, genre, country, city, artist);
    } else {
      getEvents();
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [dateFrom, dateTill, genre, country, city, artist]);

  // once events are fetched, filter the events
  useEffect(() => {
    addEvents(events?.events, setEventsArray);
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

  useEffect(() => {
    if (!name) {
      setDateFrom("");
      setDateTill("");
      setGenre("");
      setCity("");
      setArtist("");
      fetchEvents();
    }
  }, [name]);

  return (
    <div className={classes.appContainer}>
      <EventContext.Provider value={{ events, loading }}>
        <div ref={titleRef}>
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
        </div>
        {displayFixedNavBar && !name && (
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
        )}

        <div className={classes.routesContainer}>
          {name === "artistPage" && link ? (
            <ArtistPage
              artistEvents={events}
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
          ) : name && !link ? (
            <PageToView
              city={city}
              country={country}
              eventsArray={eventsArray}
            />
          ) : (
            <HomePage eventsArray={eventsArray} />
          )}
        </div>
      </EventContext.Provider>
      <Footer />
    </div>
  );
};

export default App;

// to read for tomorrow:

/**
 * todos:
 * design artist-page
 *
 * if no genre/artist/event in (city/country)/date etc is found, display a page that says so
 * --currently, nothing is updated and you view the same things you searched prior to your un-found search
 *
 * Make so country and city is visible on search bar on home-page & artist-page as well
 * make so changing city on home-page takes you to event-page
 *
 * make so arrows on home-page for favorite artists etc are only visible if there are more than visible events (needs to work for when you scale make the site smaller as well)
 *
 * add logo to navbar when u scroll
 *
 * add loading svg animation to top middle of events-page
 *
 * add dots to home-pages big images to show which current image is displayed
 *
 * current-page buttons (left right on events-page) isnt working correclty right now. They are white when they shouldn't be and gray when they shouldn't be
 * --and display too many pages sometimes
 *
 * style the arrows (left/right) for big image on home-page
 *
 */
