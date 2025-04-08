import App from "./src/App";

const routes = [
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "profile/:name",
    // element: <Profile />,
  },
];

export default routes;
