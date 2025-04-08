import App from "./App";
import MainPage from "./PAGES/defaultPage";

const routes = [
  {
    path: "/home/:name?/:link?",
    element: <App />,
    // errorElement: <ErrorPage />,
  },
];

export default routes;
