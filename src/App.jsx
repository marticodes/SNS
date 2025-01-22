import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatPage from "../src/pages/ChatPage";
import UserPage from "../src/pages/UserPage";
import MainPage from "../src/pages/MainPage";

const App = () => {
  return (
    <Router>
      {/* Main Content */}
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ textAlign: "center" }}>
                <h1>Welcome</h1>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <Link to="/chat" style={navButtonStyle}>
                    Chat
                  </Link>
                  <Link to="/UserPage" style={navButtonStyle}>
                    User Profile
                  </Link>
                  <Link to="/MainPage" style={navButtonStyle}>
                    Main Page
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/UserPage" element={<UserPage />} />
          <Route path="/MainPage" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
};

const navButtonStyle = {
  color: "#fff",
  backgroundColor: "#34495e",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  width: "200px",
  display: "block",
  textAlign: "center",
};

export default App;

