import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 페이지 컴포넌트 가져오기
import Main from './pages/Main';
import Course from './pages/Course';
import ProvinceSpotlight from './pages/Random/province';
import CityRandom from './pages/Random/city';
import ThemeRandom from './pages/Random/theme';
import PostResult from './pages/PostResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/random" element={<ProvinceSpotlight />} />
        <Route path="/random/city" element={<CityRandom />} />
        <Route path="/random/theme" element={<ThemeRandom />} />
        <Route path="/course" element={<Course />} />
        <Route path="/postResult" element={<PostResult />} />
      </Routes>
    </Router>
  );
}

export default App;
