import { useParams, Link } from "react-router-dom";
import { useEffect, useState, createContext, useCallback } from "react";

import classes from "../src/PAGES/defaultPage.module.scss";

import AccountPage from "./PAGES/account";
import AboutUsPage from "./PAGES/aboutUs";
import UpcomingEventsPage from "./PAGES/upcomingEvents";

import NavBar from "./COMPONENTS/defaultPage/navBar/navBar";
import Footer from "./COMPONENTS/defaultPage/footer/footer";
import { bigCities } from "./COMPONENTS/defaultPage/searchInput/inputInformation";

export const EventContext = createContext();

const fetchData = async (
  size,
  page,
  dateStart,
  dateEnd,
  genre,
  country,
  city
) => {
  const BASE_URL = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music`;
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  let url = `${BASE_URL}&apikey=${ticketMasterApiKey}&size=25&page=0`;

  if (dateStart && dateEnd) {
    url += `&startDateTime=${dateStart}T00:00:00Z&endDateTime=${dateEnd}T23:59:59Z`;
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

  console.log(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fetched failed");
    }

    const data = await response.json();

    console.log(data);
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
  const [country, setCountry] = useState("DE");
  const [city, setCity] = useState(Object.keys(bigCities[country])[0]);

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
  };

  const PageToView = namePage[name];

  const getEvents = useCallback(
    async (size, page, dateStart, dateEnd, genre, country, city) => {
      setLoading(true);
      const fetchedData = await fetchData(
        size,
        page,
        dateStart,
        dateEnd,
        genre,
        country,
        city
      );
      if (fetchedData) {
        setEvents(fetchedData._embedded);
        setLoading(false);
      }
    }
  );

  useEffect(() => {
    getEvents("", "", "", "", "", country, city);
  }, []);

  useEffect(() => {
    setCity(Object.keys(bigCities[country])[0]);
  }, [country]);

  useEffect(() => {
    if (dateFrom || dateTill || genre || country || city) {
      getEvents("", "", dateFrom, dateTill, genre, country, city);
    }

    if (!dateFrom && !dateTill && !genre && !country && city) {
      getEvents();
    }
  }, [dateFrom, dateTill, genre, country, city]);

  return (
    <div className={classes.appContainer}>
      <EventContext.Provider value={{ events, loading }}>
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
 * -- there are buggs but currently theyre unknow.
 * -- !!Note them down once they are found!!
 *
 * Fix page button so you cant click into pages that dont exist
 *
 * Fix so that the container that has events scales!
 * -- currently, if a event is too big, it drops down unto footer
 *
 * Make it so if you click enter on search-bar, "Upcoming Events" is automatically tabbed
 *
 * clear-filter also clears input, but doesn't reset country/city
 *
 * SVG zoom on search-bar gets white bars when scaling down website
 *
 * placeholder country and city need to start with big letter
 */
