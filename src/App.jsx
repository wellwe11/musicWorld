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

export const EventContext = createContext();

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
  const BASE_URL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music`;
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  let url = `${BASE_URL}&apikey=${ticketMasterApiKey}&size=200`;

  if (artist) {
    url += `&keyword=${artist}`;

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

  console.log(url);

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
      return getEvents(
        "",
        "",
        dateFrom,
        dateTill,
        genre,
        country,
        city,
        artist
      );
    } else {
      return getEvents();
    }
  };

  useEffect(() => {
    if (!name) {
      setDateFrom("");
      setDateTill("");
      setGenre("");
      setCity("");
      setArtist("");
    }

    if (name !== "artistPage") {
      setArtist("");
    }
  }, [name, home]);

  //
  useEffect(() => {
    console.log(dateFrom, dateTill, genre, country, city, artist);
    if (dateFrom || dateTill || genre || city) {
      handleNavigate("./home/upcomingEvents");

      fetchEvents();
    }
    if (country) {
      fetchEvents();
    }

    if (artist) {
      fetchEvents();
    }
  }, [dateFrom, dateTill, genre, country, city, artist]);

  // once events are fetched, filter the events
  useEffect(() => {
    if (events) {
      console.log(events);
      return addEvents(events?.events, setEventsArray);
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
        {displayFixedNavBar && (!name || name === "artistPage") && (
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
              artist={artist}
              eventsArray={eventsArray}
              interestedArtists={interestedArtists}
              setInterestedArtists={setInterestedArtists}
            />
          ) : name && !link ? (
            <PageToView
              city={city}
              country={country}
              eventsArray={eventsArray}
              interestedArtists={interestedArtists}
              setInterestedArtists={setInterestedArtists}
            />
          ) : (
            <HomePage
              eventsArray={eventsArray}
              interestedArtists={interestedArtists}
              setInterestedArtists={setInterestedArtists}
            />
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
 *
 * if no genre/artist/event in (city/country)/date etc is found, display a page that says so
 * --currently, nothing is updated and you view the same things you searched prior to your un-found search
 *
 * * add dots to home-pages big images to show which current image is displayed
 * * style the arrows (left/right) for big image on home-page
 *
 * make so arrows on home-page for favorite artists etc are only visible if there are more than visible events (needs to work for when you scale make the site smaller as well)
 *
 * add logo to navbar when u scroll
 *
 * add loading svg animations
 * -- to home-page
 * -- to event-page
 * -- to artist-page
 *
 *
 * current-page buttons (left right on events-page) isnt working correclty right now. They are white when they shouldn't be and gray when they shouldn't be
 * --and display too many pages sometimes
 *
 * create intersted-object on App.jsx. You can add to it and remove from all pages that has interested-button (artist page, (will add to upcomingEvents), home-page)
 *
 *
 * Fix so that the page doesnt refresh so many times
 *
 *
 * Currently, if you select date till, it wont allow for a search..?
 *
 *
 * Fix so you cant add to following-list on artist-page if everything isnt loaded (causes the object to be pushed as undefined.)
 * --also create a fallback for when object is undefined
 *
 *
 *  display more events on event-page per page. Currently 6, Im thinking 12 per page
 */
