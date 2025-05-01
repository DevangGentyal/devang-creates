import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="short-form" element={<VideoPage type="short" />} />
          <Route path="long-form" element={<VideoPage type="long" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;