import { useParams, Link } from "react-router-dom";
import { useEffect, useState, createContext, useCallback } from "react";

import classes from "../src/PAGES/defaultPage.module.scss";

import AccountPage from "./PAGES/account";
import AboutUsPage from "./PAGES/aboutUs";
import UpcomingEventsPage from "./PAGES/upcomingEvents";

import NavBar from "./COMPONENTS/defaultPage/navBar/navBar";
import Footer from "./COMPONENTS/defaultPage/footer/footer";

export const EventContext = createContext();

const fetchData = async (size, page, dateStart, dateEnd, genre) => {
  const BASE_URL =
    "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=SE";
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  let url = `${BASE_URL}&apikey=${ticketMasterApiKey}&size=25&page=0`;

  if (dateStart && dateEnd) {
    url += `&startDateTime=${dateStart}T00:00:00Z&endDateTime=${dateEnd}T23:59:59Z`;
  }

  if (genre) {
    url += `&genreId=${genre}`;
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

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { home, name, link } = useParams();
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTill, setDateTill] = useState(null);
  const [genre, setGenre] = useState(null);

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
  };

  const PageToView = namePage[name];

  const getEvents = useCallback(
    async (size, page, dateStart, dateEnd, genre) => {
      setLoading(true);
      const fetchedData = await fetchData(
        size,
        page,
        dateStart,
        dateEnd,
        genre
      );
      if (fetchedData) {
        setEvents(fetchedData._embedded);
        setLoading(false);
      }
    }
  );

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    if (dateFrom && dateTill) {
      getEvents("", "", dateFrom, dateTill, "");
    }

    if (genre) {
      getEvents("", "", "", "", genre);
    }

    if (!dateFrom && !dateTill && !genre) {
      getEvents();
    }
  }, [dateFrom, dateTill, genre]);

  return (
    <div className="appContainer">
      <EventContext.Provider value={{ events, loading }}>
        <NavBar
          setDateFrom={setDateFrom}
          setDateTill={setDateTill}
          dateFrom={dateFrom}
          dateTill={dateTill}
          genre={genre}
          setGenre={setGenre}
        />
        <div className={classes.routesContainer}>
          {name && events ? (
            <PageToView />
          ) : (
            <>
              <h1>welcome home</h1>
            </>
          )}
        </div>
      </EventContext.Provider>
      <Footer />
    </div>
  );
}

export default App;

// to read for tomorrow:

/**
 *
 * Fix search-bar
 * Fix page button so you cant click into pages that dont exist
 */
