import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Main = () => {
  return (
    <div className="main-container">
      <h1>도파민 여행</h1>
      <p>메인 페이지에 오신 것을 환영합니다!</p>
      <div className="main-buttons">
        <Link to="/random">
          <button className="start-button">랜덤 여행 시작</button>
        </Link>
        <button className="about-button">소개</button>
      </div>
    </div>
  );
};

export default Main; 