import React from "react";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <div className="App">
      <Login />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;