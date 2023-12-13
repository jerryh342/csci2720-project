import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Redirect } from "react-router-dom";
import { Button } from "antd";
import NavBar from "./navbar";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const getLoggedIn = () => {
      try {
        axios({
          method: "GET",
          url: "http://localhost:8000/home",
          withCredentials: true,
        })
          .then(async (res) => {
            const result = await res.data;
            setIsLoggedIn(true);
            console.log("res>>", result);
          })
          .catch((err) => {
            setIsLoggedIn(false);
            return navigate("/login");
          });
      } catch (error) {
        console.log("error>>", error);
        return navigate("/login");
      }
    };
    getLoggedIn();
  }, []);
  if (!isLoggedIn) return <h1>Not authenticated, logging you out...</h1>;
  return (
    <div>
      <NavBar />
      <h1>Home Component, You are logged in</h1>
    </div>
  );
}

export default Home;
