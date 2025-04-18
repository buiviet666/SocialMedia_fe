import { Provider } from "react-redux";
import { store } from "./store";
import { RouterProvider } from "react-router-dom";
import RoutesList from "./routes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={RoutesList} />
    </Provider>
  );
}

export default App;
