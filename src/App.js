import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StakingPage from "./pages/StakingPage";
import '../src/pages/index.css';

const renderLoader = () => (
  <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center bg-gradient-to-t from-blue-500 via-blue-300 to-blue-500">
    <img src={'./image/loading.png'} alt="logo" className="animate-pulse w-10 h-10" />
  </div>
);

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {
        ready ? (
          <div className="App" >
            <Router>
              <Routes>
                <Route path="/" element={<StakingPage />} />
              </Routes>
              <ToastContainer pauseOnFocusLoss={true} position="top-right" autoClose={3000} toastClassName={'toast-theme text-white'} />
            </Router>
          </div>
        ) : (
          renderLoader()
        )
      }
    </>
  );
}

export default App;
