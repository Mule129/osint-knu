import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './mainPage.jsx'
import ResultPage from './resultPage.jsx'

function App() {
    return (
      <Router>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/result" element={<ResultPage />} />
        </Routes>
    </Router>
  );
}

export default App;