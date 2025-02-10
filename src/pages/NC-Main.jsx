import React from "react";
import NavBar from "../components/NavBar/Full"; // Adjust the import path as needed

const NCPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Navigation Bar */}
      <NavBar caseId={2}/>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>JUST TEST</h1>
        <p>TEST UI</p>
      </div>
    </div>
  );
};

export default NCPage;