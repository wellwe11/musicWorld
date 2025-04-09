import { useParams, Link } from "react-router-dom";

import "./App.css";

import DefaultUI from "./PAGES/defaultPage";

import AccountPage from "./PAGES/account";
import AboutUsPage from "./PAGES/aboutUs";
import UpcomingEventsPage from "./PAGES/upcomingEvents";
import { useEffect, useState, createContext } from "react";

const fetchData = async () => {
  const ticketMasterApiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=${ticketMasterApiKey}`
    );

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

export const EventContext = createContext();
function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEvents = async () => {
    const fetchedData = await fetchData();
    if (fetchedData) {
      setEvents(fetchedData._embedded.events);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const { home, name, link } = useParams();

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
  };

  const PageToView = namePage[name];

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
