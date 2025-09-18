import {
  createBrowserRouter,
  Outlet,
  type RouteObject,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import Home from "../Page/Home";
import VocabQuiz from "../Page/VocabQuiz";

const ROUTES_CONFIG: RouteObject[] = [
  {
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "quiz",
        element: <VocabQuiz />,
      },
    ],
  },
];

export const routes = createBrowserRouter(ROUTES_CONFIG);
