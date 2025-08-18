import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Course.module.css';
import environment from '../../environments/environment';
// SEO 컴포넌트 가져오기
import SEO from '../../components/SEO';
import { getPageMetadata } from '../../utils/seoUtils';

const Course = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { province, city, theme, constraint } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 파라미터가 없을 때 기본값 설정 (SEO용)
  const defaultProvince = { name: '전국' };
  const defaultCity = { name: '여행지' };
  const defaultTheme = { name: '맞춤 테마' };
  const defaultConstraint = { name: '자유 여행' };
  
  const displayProvince = province || defaultProvince;
  const displayCity = city || defaultCity;
  const displayTheme = theme || defaultTheme;
  // displayConstraint는 사용하지 않으므로 제거
  
  // 카드 관련 상태 (courses를 먼저 정의)
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [courses, setCourses] = useState([]);
  
  // SEO 메타데이터 생성
  const seoMetadata = getPageMetadata('course', {
    itinerary: courses.length > 0 ? {
      title: `${displayProvince.name} ${displayCity.name} 여행 코스`,
      description: `${displayTheme.name} 테마로 즐기는 ${displayProvince.name} ${displayCity.name} 여행`,
      places: courses,
      duration: '1일'
    } : null
  });

  // 파라미터가 없을 때의 공갈 페이지 렌더링
  if (!province || !city || !theme || !constraint) {
    return (
      <div className={styles.courseContainer}>
        <SEO
          title={seoMetadata.title}
          description={seoMetadata.description}
          keywords={seoMetadata.keywords}
          type={seoMetadata.type}
          structuredData={seoMetadata.structuredData}
        />
        
        <div className={styles.courseHeader}>
          <h1>🗺️ AI 추천 여행 코스</h1>
          <p>맞춤형 여행 코스를 생성해드립니다</p>
        </div>
        
        <div className={styles.noParamsMessage}>
          <h2>📍 여행 코스 생성 서비스</h2>
          <p>선택하신 여행지와 테마를 바탕으로 AI가 최적의 여행 코스를 추천해드립니다.</p>
          
          <div className={styles.serviceFeatures}>
            <div className={styles.feature}>
              <h3>🎯 맞춤형 추천</h3>
              <p>지역, 테마, 제약조건을 고려한 개인화된 여행 코스</p>
            </div>
            <div className={styles.feature}>
              <h3>🎲 랜덤 선택</h3>
              <p>카드 뽑기 방식으로 재미있게 코스 선택</p>
            </div>
            <div className={styles.feature}>
              <h3>📋 상세 정보</h3>
              <p>각 장소별 상세 설명과 추천 이유 제공</p>
            </div>
          </div>
          
          <div className={styles.navigationButtons}>
            <button onClick={() => navigate('/')}>홈으로 가기</button>
            <button onClick={() => navigate('/random')}>여행지 선택하기</button>
          </div>
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
    <SEO
      title={seoMetadata.title}
      description={seoMetadata.description}
      keywords={seoMetadata.keywords}
      type={seoMetadata.type}
      structuredData={seoMetadata.structuredData}
    />

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
