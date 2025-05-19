import { Provider } from "react-redux";
import { store } from "./store";
import { RouterProvider } from "react-router-dom";
import RoutesList from "./routes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";
import FullScreenLoader from "./components/Loading";

function App() {
  return (
    <Provider store={store}>
      <FullScreenLoader />
      <Toaster 
        toastOptions={{
          duration: 3000,
        }}/>
      <RouterProvider router={RoutesList} />
    </Provider>
  );
}

export default App;
