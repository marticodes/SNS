import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CGPage from "../src/pages/CG-Main"; // case 4
import CFPage from "./pages/CF-Main"; // case 3
import NCPage from "./pages/NC-Main"; // case 2
import NFPage from "./pages/NF-Main";  // case 1
import UserPage from "./pages/UserPage";
import ChatPage from "./pages/ChatPage";

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
                  <Link to="/case/1" style={navButtonStyle}>
                    Case 1 - Network-Following
                  </Link>
                  <Link to="/case/2" style={navButtonStyle}>
                    Case 2 - Network-Group
                  </Link>
                  <Link to="/case/3" style={navButtonStyle}>
                    Case 3 - Chat-Following
                  </Link>
                  <Link to="/case/4" style={navButtonStyle}>
                    Case 4 - Chat-Group
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/case/1" element={<NFPage />} />
          <Route path="/case/2" element={<NCPage />} />
          <Route path="/case/3" element={<CFPage />} />
          <Route path="/case/4" element={<CGPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/dms" element={<ChatPage />} />
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