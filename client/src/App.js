import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>} />
    </Routes>
  </BrowserRouter>;
}

export default App;