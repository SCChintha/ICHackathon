import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Articles from "./Articles.jsx";
import Dashboard from "./Dashboard.jsx";
import Resources from "./Resources.jsx";
import Quiz from "./Quiz.jsx";
import Profile from "./Profile.jsx";
import Contact from "./Contact.jsx";
import "./index.css";

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="navbar">
      {!isAuthenticated && <Link to="/login">Login</Link>}
      {isAuthenticated && (
        <>
          <Link to="/articles">Articles</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/contact">Contact</Link>
          <button className="nav-logout" onClick={onLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user || null);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/");
  };

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [isAuthenticated, currentUser]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        {isAuthenticated && (
          <>
            <Route
              path="/articles"
              element={
                <>
                  <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                  <Articles />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <>
                  <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/resources"
              element={
                <>
                  <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                  <Resources />
                </>
              }
            />
            <Route
              path="/quiz"
              element={
                <>
                  <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                  <Quiz />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                  <Profile user={currentUser} />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                  <Contact />
                </>
              }
            />
          </>
        )}
      </Routes>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AppRouter />
    </HashRouter>
  </React.StrictMode>
);
