import { useParams, Link } from "react-router-dom";

import "./App.css";

import DefaultUI from "./PAGES/defaultPage";

import AccountPage from "./PAGES/account";
import AboutUsPage from "./PAGES/aboutUs";
import UpcomingEventsPage from "./PAGES/upcomingEvents";
import { createContext, useState } from "react";

export const ActiveTab = createContext();

function App() {
  const { home, name, link } = useParams();

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
  };

  const PageToView = namePage[name];

  return (
    <div className="appContainer">
      <ActiveTab.Provider value={{ home, name, link }}>
        <DefaultUI />
        {name ? (
          <PageToView />
        ) : (
          <>
            <h1>welcome home</h1>
          </>
        )}
      </ActiveTab.Provider>
    </div>
  );
}

export default App;
