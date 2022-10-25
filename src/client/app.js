import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import About from "./pages/About";
import PostmanEcho from "./pages/PostmanEcho";
import Welcome from "./pages/Welcome";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/postman-echo" element={<PostmanEcho />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
};
export default App;
