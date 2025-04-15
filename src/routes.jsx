import App from "./App";

const routes = [
  {
    path: "/home/:name?/:link?",
    element: <App />,
    // errorElement: <ErrorPage />,
  },
];

export default routes;
