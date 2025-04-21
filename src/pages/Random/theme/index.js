import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllThemes } from '../../../api/Random/getAllThemeAPI';
import { getAllConstraints } from '../../../api/Random/getAllConstraintAPI';
import './styles.css';

const ThemeRandom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [themes, setThemes] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedConstraint, setSelectedConstraint] = useState(null);
  const [themePosition, setThemePosition] = useState(0);
  const [constraintPosition, setConstraintPosition] = useState(0);
  const themeSlotRef = useRef(null);
  const constraintSlotRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // location.state에서 province와 city 정보 가져오기
  const { province, city } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 테마와 제약 동시에 불러오기
        const [themeResult, constraintResult] = await Promise.all([
          getAllThemes(),
          getAllConstraints()
        ]);
        
        if (themeResult.code === "SUCCESS" && themeResult.data && themeResult.data.length > 0) {
          setThemes(themeResult.data);
        } else {
          console.error('테마 데이터를 불러오는데 실패했습니다:', themeResult.message);
        }
        
        if (constraintResult.code === "SUCCESS" && constraintResult.data && constraintResult.data.length > 0) {
          setConstraints(constraintResult.data);
        } else {
          console.error('제약 데이터를 불러오는데 실패했습니다:', constraintResult.message);
        }
      } catch (error) {
        console.error('API 호출 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const startSpin = () => {
    if (spinning || themes.length === 0 || constraints.length === 0) return;
    
    setSpinning(true);
    setSelectedTheme(null);
    setSelectedConstraint(null);
    
    // 각 슬롯이 돌아갈 횟수 (테마와 제약 슬롯이 다른 속도로 돌아가도록 설정)
    const themeSpins = 30 + Math.floor(Math.random() * 15);  // 30-45번 회전
    const constraintSpins = 25 + Math.floor(Math.random() * 15);  // 25-40번 회전
    
    // 선택될 인덱스 랜덤 결정
    const selectedThemeIndex = Math.floor(Math.random() * themes.length);
    const selectedConstraintIndex = Math.floor(Math.random() * constraints.length);
    
    // 애니메이션
    let themeCount = 0;
    let constraintCount = 0;
    
    const slotInterval = setInterval(() => {
      // 테마 슬롯 회전
      if (themeCount < themeSpins) {
        setThemePosition(prevPos => (prevPos + 1) % themes.length);
        themeCount++;
      }
      
      // 제약 슬롯 회전
      if (constraintCount < constraintSpins) {
        setConstraintPosition(prevPos => (prevPos + 1) % constraints.length);
        constraintCount++;
      }
      
      // 모든 슬롯 회전이 끝나면 결과 표시
      if (themeCount >= themeSpins && constraintCount >= constraintSpins) {
        clearInterval(slotInterval);
        setThemePosition(selectedThemeIndex);
        setConstraintPosition(selectedConstraintIndex);
        setSelectedTheme(themes[selectedThemeIndex]);
        setSelectedConstraint(constraints[selectedConstraintIndex]);
        setSpinning(false);
      }
    }, 100); // 0.1초마다 회전
  };

  const handleAccept = () => {
    if (selectedTheme && selectedConstraint && province && city) {
      navigate('/result', { 
        state: { 
          province: province,
          city: city,
          theme: selectedTheme,
          constraint: selectedConstraint
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="theme-container">
        <h1>{province?.name} {city?.name} 테마 랜덤 선택</h1>
        <div className="loading">
          <p>테마 정보를 불러오는 중...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-container">
      <h1>{province?.name} {city?.name} 테마 랜덤 선택</h1>
      
      {(themes.length === 0 || constraints.length === 0) ? (
        <div className="error-message">
          <p>테마 또는 제약 정보를 불러오는데 실패했습니다.</p>
        </div>
      ) : (
        <>
          <div className="slots-container">
            <div className="slot-machine">
              <div className="slot-header">테마</div>
              <div className="slot-window">
                <div 
                  className="slot-items"
                  ref={themeSlotRef}
                  style={{ 
                    transform: `translateY(-${themePosition * 60}px)`,
                    transition: spinning ? 'transform 0.1s ease' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                >
                  {themes.map((theme, index) => (
                    <div 
                      key={theme.no} 
                      className={`slot-item ${selectedTheme && selectedTheme.no === theme.no ? 'selected' : ''}`}
                    >
                      {theme.name}
                    </div>
                  ))}
                </div>
                <div className="slot-highlight"></div>
              </div>
            </div>
            
            <div className="slot-machine">
              <div className="slot-header">제약</div>
              <div className="slot-window">
                <div 
                  className="slot-items"
                  ref={constraintSlotRef}
                  style={{ 
                    transform: `translateY(-${constraintPosition * 60}px)`,
                    transition: spinning ? 'transform 0.1s ease' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                >
                  {constraints.map((constraint, index) => (
                    <div 
                      key={constraint.no} 
                      className={`slot-item ${selectedConstraint && selectedConstraint.no === constraint.no ? 'selected' : ''}`}
                    >
                      {constraint.name}
                    </div>
                  ))}
                </div>
                <div className="slot-highlight"></div>
              </div>
            </div>
          </div>
          
          <button
            className="spin-button"
            onClick={startSpin}
            disabled={spinning}
          >
            {spinning ? '랜덤 선택 중...' : '랜덤 선택하기'}
          </button>

          <AnimatePresence>
            {selectedTheme && selectedConstraint && !spinning && (
              <motion.div
                className="result-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>🎉 선택된 테마와 제약 🎉</h2>
                <div className="result-details">
                  <div className="result-item">
                    <strong>테마:</strong> {selectedTheme.name}
                  </div>
                  <div className="result-item">
                    <strong>제약:</strong> {selectedConstraint.name}
                  </div>
                </div>
                <div className="result-summary">
                  <p>{province?.name} {city?.name}에서 <strong>{selectedTheme.name}</strong> 테마로 <strong>{selectedConstraint.name}</strong> 제약 조건으로 여행을 즐겨보세요!</p>
                </div>
                <div className="result-buttons">
                  <button
                    className="accept-button"
                    onClick={handleAccept}
                  >
                    결과 확인하기
                  </button>
                  <button
                    className="regenerate-button"
                    onClick={startSpin}
                  >
                    다시 선택하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ThemeRandom; 