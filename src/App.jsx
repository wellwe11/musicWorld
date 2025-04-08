import { useParams, Link } from "react-router-dom";

import "./App.css";

import DefaultUI from "./PAGES/defaultPage";

function App() {
  const { home, name, link } = useParams();

  console.log(home, name, link);

  return (
    <>
      <DefaultUI />
      {link ? (
        <>
          <h1>welcome to link page </h1>
          <Link to="/home/"> Take me home </Link>
        </>
      ) : name ? (
        <>
          <h1>welcome to name page</h1>
          <Link to="/home/asd/asd"> Take me to link page </Link>
        </>
      ) : (
        <>
          <h1>welcome home</h1>
          <Link to="/home/link"> Take me to link page </Link>
        </>
      )}
    </>
  );
}

export default App;
