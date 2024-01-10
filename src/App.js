import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StakingPage from "./pages/StakingPage";
import '../src/pages/index.css';

const renderLoader = () => (

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
