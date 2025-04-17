import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 페이지 컴포넌트 가져오기
import Main from './pages/Main';
import Result from './pages/Result';
import ProvinceRoulette from './pages/Random/province';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/random" element={<ProvinceRoulette />} />
        <Route path="/random/city" element={<div>도시 선택 페이지 - 개발 예정</div>} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
