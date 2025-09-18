import { RouterProvider } from "react-router-dom";
import { routes } from "./layouts/routes-config";

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
