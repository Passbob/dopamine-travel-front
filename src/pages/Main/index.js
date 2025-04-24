import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './styles.css';
// 실제 이미지 파일 사용
import diceImage from '../../assets/dice.png';
import mapImage from '../../assets/map.png';
// 방문자 수 API 가져오기
import { getTotalVisits } from '../../api/Main/totalVisitAPI';
// 슬롯 카운터 컴포넌트
import SlotCounter from '../../components/SlotCounter';
import '../../components/SlotCounter.css';

const Main = () => {
  // 방문자 수 상태 관리
  const [visitorCount, setVisitorCount] = useState(0);
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 방문자 수 가져오기
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const count = await getTotalVisits();
        setVisitorCount(count);
      } catch (error) {
        console.error('방문자 수 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorCount();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 카드 드롭 애니메이션을 위한 variants 정의
  const cardVariants = {
    hidden: { 
      y: -100,
      opacity: 0,
      scale: 0.8
    },
    visible: (custom) => ({ 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 15,
        delay: custom * 0.2,
        duration: 0.4
      } 
    }),
    hover: {
      y: -15,
      boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.3)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <div className="main-container">
      <div className="main-content">
        <motion.h1 
          className="main-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          도파민 여행
        </motion.h1>
        
        <motion.p 
          className="main-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          여행지 아직도 못 고르셨나요? AI추천 기반으로 랜덤 여행지를 정해보세요
        </motion.p>
        
        <motion.div 
          className="sub-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p>
            도파민과 함께 여행을 떠난 {' '}
            {isLoading ? (
              '로딩 중...'
            ) : (
              <SlotCounter 
                value={visitorCount} 
                duration={2500}
                delay={500}
                
              />
            )}
            명의 트레블러
          </p>
        </motion.div>
        
        <div className="travel-options">
          <motion.div
            className="travel-option-wrapper"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link to="/random" className="travel-option random">
              <div className="image-container">
                <img src={diceImage} alt="주사위" className="option-image" />
              </div>
              <div className="option-title">랜덤 여행</div>
            </Link>
          </motion.div>
          
          <motion.div
            className="travel-option-wrapper"
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div className="travel-option-disabled-container">
              <Link 
                to="#" 
                className="travel-option random-with-options disabled-option"
                onClick={(e) => e.preventDefault()}
              >
                <div className="image-container">
                  <img src={mapImage} alt="지도" className="option-image" />
                </div>
                <div className="option-title">도는 선택하고<br />랜덤 여행</div>
              </Link>
              <div className="disabled-line"></div>
              <div className="coming-soon-badge">준비 중</div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="inquiry-button"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.2
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="inquiry-icon">?</div>
        <span className="inquiry-text">문의</span>
      </motion.div>
    </div>
  );
};

export default Main; 