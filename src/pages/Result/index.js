import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const Result = () => {
  const navigate = useNavigate();
  
  // 실제로는 라우터의 state 또는 파라미터로 여행지 정보를 받게 됩니다
  const destination = {
    name: '서울 북촌 한옥마을',
    description: '전통적인 한옥 거리를 경험할 수 있는 곳입니다. 조선시대 양반들이 살던 고급 주택가로, 아름다운 한옥과 좁은 골목길이 남아있어 전통적인 한국의 주거 문화를 경험할 수 있습니다.',
    image: 'https://via.placeholder.com/600x400',
    rating: 4.5,
    address: '서울특별시 종로구 계동길 37',
    attractions: [
      '한옥 체험',
      '전통 공방',
      '전통 찻집',
      '갤러리'
    ],
    tips: '주말에는 관광객이 많으니 평일 방문을 추천합니다. 편안한 신발을 신고 방문하세요.'
  };

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <h1>{destination.name}</h1>
        <div className="rating">
          <span className="stars">{'★'.repeat(Math.floor(destination.rating))}{'☆'.repeat(5-Math.floor(destination.rating))}</span>
          <span className="rating-value">{destination.rating}/5</span>
        </div>
      </div>

      <div className="destination-image">
        <img src={destination.image} alt={destination.name} />
      </div>

      <div className="destination-info">
        <h2>소개</h2>
        <p>{destination.description}</p>
        
        <h2>위치</h2>
        <p>{destination.address}</p>
        <div className="map-placeholder">
          {/* 실제로는 카카오맵 연동 */}
          <div className="map-loading">지도 로딩 중...</div>
        </div>

        <h2>추천 활동</h2>
        <ul className="attractions-list">
          {destination.attractions.map((attraction, index) => (
            <li key={index}>{attraction}</li>
          ))}
        </ul>

        <h2>여행 팁</h2>
        <p className="travel-tips">{destination.tips}</p>

        <div className="action-buttons">
          <button className="save-button">저장하기</button>
          <button className="share-button">공유하기</button>
          <button className="restart-button" onClick={handleRestart}>다시 시작하기</button>
        </div>
        
        <div className="navigation-links">
          <Link to="/" className="home-link">홈으로</Link>
          <Link to="/random" className="random-link">다른 여행지 찾기</Link>
        </div>
      </div>
    </div>
  );
};

export default Result; 