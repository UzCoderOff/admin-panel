if (typeof global === "undefined") {
  window.global = window;
}

import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home, Login } from "./components";
import { ProgressBar } from "primereact/progressbar";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkToken = async () => {
    try {
      const response = await fetch(
        "https://autoapi.dezinfeksiyatashkent.uz/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );

      const data = await response.json();
      setIsAuth(data.success);
    } catch (error) {
      console.error("Error checking token:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (loading) {
    document.title = "Loading...";
  }

  if (loading) {
    return (
      <div className="bg-[white] w-full h-[100vh] flex items-center align-middle justify-center">
        <ProgressBar
          mode="indeterminate"
          className={"fixed top-0 left-0 w-full h-3"}
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={isAuth ? <Navigate to={"/"} /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
