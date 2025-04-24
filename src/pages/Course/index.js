import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Course.module.css';
import environment from '../../environments/environment';

const Course = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { province, city, theme, constraint } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 카드 관련 상태
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [courses, setCourses] = useState([]);

  // 필요한 데이터가 있는지 확인
  if (!province || !city || !theme || !constraint) {
    return (
      <div className={styles.courseContainer}>
        <h1>오류 발생</h1>
        <div style={{ color: 'black' }} className={styles.errorMessage}>
          <p>필요한 정보가 부족합니다. 테마 선택 페이지로 돌아가세요.</p>
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  // 카드 섞기 및 데이터 로드 시작
  const startShuffleCards = async () => {
    setIsShuffling(true);
    
    // 데이터 요청
    try {
      const url = `${environment.apiBaseUrl}${environment.endpoints.prototypeTravelCourse}?provinceNo=${province.no}&cityNo=${city.no}&theme=${theme.no}&constraint=${constraint.no}`;
      
      const response = await fetch(url, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.code === 'SUCCESS') {
        // 코스 정보 추출
        const extractedCourses = [];
        for (let i = 1; i <= 6; i++) {
          const courseKey = `course${i}`;
          if (data.data[courseKey]) {
            try {
              const courseInfo = typeof data.data[courseKey] === 'string' 
                ? JSON.parse(data.data[courseKey])
                : data.data[courseKey];
                
              if (courseInfo.name) {
                extractedCourses.push({
                  order: i,
                  ...courseInfo
                });
              }
            } catch (e) {
              console.error(`코스 ${i} 파싱 오류:`, e);
            }
          }
        }
        
        setCourses(extractedCourses);
        
        // 데이터가 로드되면 카드 준비 화면으로 전환
        setIsShuffling(false);
        setCardsReady(true);
      } else {
        setIsShuffling(false);
        setError(data.message || '코스를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setIsShuffling(false);
      setError('서버 요청 중 오류가 발생했습니다.');
      console.error('코스 요청 오류:', err);
    }
  };

  // 카드 선택 처리
  const handleCardSelect = (cardIndex) => {
    setSelectedCard(cardIndex);
    
    // 카드 선택 후 결과 표시
    setTimeout(() => {
      setCardsReady(false);
      setShowResult(true);
    }, 1000);
  };

  // 홈으로 돌아가기
  const handleGoHome = () => {
    navigate('/');
  };

  // 복사 기능 추가
  const copyResultToClipboard = () => {
    if (courses.length === 0) return;
    
    // 복사할 텍스트 생성
    let resultText = `${province?.name} ${city?.name} 여행 코스\n`;
    resultText += `테마: ${theme?.name} / 제약: ${constraint?.name}\n\n`;
    
    // 각 코스 정보 추가
    courses.forEach((course, index) => {
      resultText += `${index + 1}. ${course.name}\n`;
      resultText += `${course.description}\n\n`;
    });
    
    // 클립보드에 복사
    navigator.clipboard.writeText(resultText)
      .then(() => {
        alert('여행 코스가 클립보드에 복사되었습니다!');
      })
      .catch(err => {
        console.error('복사 중 오류가 발생했습니다:', err);
        alert('복사 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
  };

  if (isLoading) {
    return (
      <div className={styles.courseContainer}>
        <h1>{province?.name} {city?.name} 여행 코스</h1>
        <div className={styles.loading}>
          <p>코스 정보를 불러오는 중...</p>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.courseContainer}>
        <h1 style={{ color: 'red' }}>오류 발생</h1>
        <div style={{ color: 'black' }} className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={handleGoHome}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.courseContainer}>
      <div className={styles.courseHeader}>
        <h1>{province?.name} {city?.name} 여행 코스</h1>
        <p>테마: {theme?.name} / 제약: {constraint?.name}</p>
      </div>

      {courses.length === 0 && !isShuffling && !cardsReady ? (
        <motion.div 
          className={styles.cardDrawContainer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2>여행 코스 카드를 뽑아보세요!</h2>
          <motion.button 
            className={styles.drawCardButton}
            onClick={startShuffleCards}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            카드 섞기
          </motion.button>
        </motion.div>
      ) : (
        <AnimatePresence>
          {isShuffling && (
            <motion.div 
              className={styles.shufflingAnimation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.cardDeckContainer}>
                {/* 왼쪽 카드 */}
                <motion.div 
                  className={styles.cardInDeck}
                  animate={{ 
                    translateX: [0, -100, 100, -50, 0],
                    translateY: [0, 50, -50, 30, 0],
                    rotateZ: [0, -10, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                >
                  <div className={styles.cardBack}>A</div>
                </motion.div>
                
                {/* 가운데 카드 */}
                <motion.div 
                  className={styles.cardInDeck}
                  animate={{ 
                    translateX: [0, 100, -100, 50, 0],
                    translateY: [0, -30, 30, -20, 0],
                    rotateZ: [0, 10, -10, 5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <div className={styles.cardBack}>B</div>
                </motion.div>
                
                {/* 오른쪽 카드 */}
                <motion.div 
                  className={styles.cardInDeck}
                  animate={{ 
                    translateX: [0, 50, -50, 20, 0],
                    translateY: [0, -50, 50, -30, 0],
                    rotateZ: [0, 5, -5, 2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <div className={styles.cardBack}>C</div>
                </motion.div>
              </div>
              <p>카드를 섞는 중입니다...</p>
            </motion.div>
          )}

          {cardsReady && (
            <motion.div 
              className={styles.cardsReadyContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2>여행 코스 카드를 선택하세요!</h2>
              <div className={styles.cardSelectionContainer}>
                {/* 왼쪽 카드 */}
                <motion.div 
                  className={`${styles.selectionCard} ${selectedCard === 0 ? styles.selectedCard : ''}`}
                  whileHover={!selectedCard ? { scale: 1.05 } : {}}
                  initial={{ scale: 1 }}
                  onClick={() => !selectedCard && handleCardSelect(0)}
                >
                  <div className={styles.cardFace}>
                    {selectedCard === 0 ? (
                      <motion.div 
                        className={styles.cardFront}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span>🎯 여행 코스</span>
                      </motion.div>
                    ) : (
                      <div className={styles.cardBack}>A</div>
                    )}
                  </div>
                </motion.div>
                
                {/* 가운데 카드 */}
                <motion.div 
                  className={`${styles.selectionCard} ${selectedCard === 1 ? styles.selectedCard : ''}`}
                  whileHover={!selectedCard ? { scale: 1.05 } : {}}
                  initial={{ scale: 1 }}
                  onClick={() => !selectedCard && handleCardSelect(1)}
                >
                  <div className={styles.cardFace}>
                    {selectedCard === 1 ? (
                      <motion.div 
                        className={styles.cardFront}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span>🎯 여행 코스</span>
                      </motion.div>
                    ) : (
                      <div className={styles.cardBack}>B</div>
                    )}
                  </div>
                </motion.div>
                
                {/* 오른쪽 카드 */}
                <motion.div 
                  className={`${styles.selectionCard} ${selectedCard === 2 ? styles.selectedCard : ''}`}
                  whileHover={!selectedCard ? { scale: 1.05 } : {}}
                  initial={{ scale: 1 }}
                  onClick={() => !selectedCard && handleCardSelect(2)}
                >
                  <div className={styles.cardFace}>
                    {selectedCard === 2 ? (
                      <motion.div 
                        className={styles.cardFront}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span>🎯 여행 코스</span>
                      </motion.div>
                    ) : (
                      <div className={styles.cardBack}>C</div>
                    )}
                  </div>
                </motion.div>
              </div>
              <p>카드를 선택하면 여행 코스가 공개됩니다.</p>
            </motion.div>
          )}

          {showResult && (
            <motion.div 
              className={styles.resultDisplay}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>🎉 추천 여행 코스 🎉</h2>
              <div className={styles.courseTimeline}>
                {courses.map((course, index) => (
                  <motion.div
                    key={index}
                    className={styles.timelineItem}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className={styles.timelineNumber}>{course.order}</div>
                    <div className={styles.timelineContent}>
                      <h3>{course.name}</h3>
                      <p>{course.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className={styles.resultActions}>
                <button
                  className={styles.homeButton}
                  onClick={handleGoHome}
                >
                  홈으로 돌아가기
                </button>
                <button
                  className={styles.copyButton}
                  onClick={copyResultToClipboard}
                >
                  결과 복사하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Course; 