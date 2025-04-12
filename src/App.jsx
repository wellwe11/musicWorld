import { useParams, Link } from "react-router-dom";

import "./App.css";

import DefaultUI from "./PAGES/defaultPage";

import AccountPage from "./PAGES/account";
import AboutUsPage from "./PAGES/aboutUs";
import UpcomingEventsPage from "./PAGES/upcomingEvents";
import { useEffect, useState, createContext, useCallback } from "react";

export const EventContext = createContext();

const fetchData = async () => {
  const BASE_URL =
    "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music";
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  const url = `${BASE_URL}&apikey=${ticketMasterApiKey}`;
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

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
  };

  const PageToView = namePage[name];

  const getEvents = useCallback(async () => {
    const fetchedData = await fetchData();
    if (fetchedData) {
      setEvents(fetchedData._embedded);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className="appContainer">
      <DefaultUI />
      <EventContext.Provider value={{ events, loading }}>
        {name && events ? (
          <PageToView />
        ) : (
          <>
            <h1>welcome home</h1>
          </>
        )}
      </EventContext.Provider>
    </div>
  );
}

export default App;
