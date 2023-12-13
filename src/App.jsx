import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SingleLocation from "./Components/SingleLocation.jsx";
import Locations from "./Components/Locations.jsx";
import Login from "./Components/login.js";
import SignUp from "./Components/signup.js";
import NoMatch from "./Components/NoMatch.jsx";
import Home from "./Components/home.js";
import Invites from "./Components/Invites.jsx";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/venue" element={<Locations />} />
          <Route path="/venue/:venueId" element={<SingleLocation />} />
          <Route path="/invites" element={<Invites />} />
          <Route path="*" element={<NoMatch />} />z
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
