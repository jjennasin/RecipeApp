import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import Browse from "./pages/Browse.jsx";
import Search from "./pages/Search.jsx";
import Recipe from "./pages/Recipe.jsx";
import Saved from "./pages/Saved.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import "./index.css";

const router = createBrowserRouter([
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/browse" replace /> },
      { path: "browse", element: <Browse /> },
      { path: "search", element: <Search /> },
      { path: "recipe/:recipeTitle", element: <Recipe /> },
      { path: "saved", element: <Saved /> },
      { path: "account", element: <AccountPage /> },
      {
        path: "account",
        element: (
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/browse" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
