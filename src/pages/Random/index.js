import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const Random = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [destination, setDestination] = useState(null);
  const navigate = useNavigate();

  const generateRandomDestination = () => {
    setIsLoading(true);
    
    // 실제로는 여기서 API 호출을 통해 랜덤 여행지를 가져오게 됩니다
    setTimeout(() => {
      setDestination({
        name: '서울 북촌 한옥마을',
        description: '전통적인 한옥 거리를 경험할 수 있는 곳',
        image: 'https://via.placeholder.com/400x300'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleAccept = () => {
    // 실제로는 여기서 선택한 여행지 정보를 state로 넘겨주거나 context에 저장할 수 있습니다
    navigate('/result');
  };

  return (
    <div className="random-container">
      <h1>랜덤 여행지 생성</h1>
      
      {!destination && !isLoading && (
        <div className="random-start">
          <p>버튼을 클릭하여 랜덤 여행지를 생성해보세요!</p>
          <button 
            className="generate-button"
            onClick={generateRandomDestination}
          >
            랜덤 여행지 생성
          </button>
          <Link to="/" className="back-link">메인으로 돌아가기</Link>
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <p>여행지를 찾고 있습니다...</p>
          <div className="spinner"></div>
        </div>
      )}

      {destination && !isLoading && (
        <div className="destination-result">
          <h2>{destination.name}</h2>
          <div className="destination-image">
            <img src={destination.image} alt={destination.name} />
          </div>
          <p>{destination.description}</p>
          <div className="result-buttons">
            <button 
              className="accept-button"
              onClick={handleAccept}
            >
              이 여행지로 결정
            </button>
            <button 
              className="regenerate-button"
              onClick={generateRandomDestination}
            >
              다시 생성하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Random; 