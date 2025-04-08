import { useParams, Link } from "react-router-dom";

import "./App.css";

import DefaultUI from "./PAGES/defaultPage";

import AccountPage from "./PAGES/account";
import AboutUsPage from "./PAGES/aboutUs";
import UpcomingEventsPage from "./PAGES/upcomingEvents";

function App() {
  const { home, name, link } = useParams();

  const namePage = {
    upcomingEvents: UpcomingEventsPage,
    aboutUs: AboutUsPage,
    account: AccountPage,
  };

  const PageToView = namePage[name];

  return (
    <>
      <DefaultUI />
      {name ? (
        <PageToView />
      ) : (
        <>
          <h1>welcome home</h1>
        </>
      )}
    </>
  );
}

export default App;
