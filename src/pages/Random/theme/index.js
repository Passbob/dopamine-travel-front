import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllThemes } from '../../../api/Random/getAllThemeAPI';
import { getAllConstraints } from '../../../api/Random/getAllConstraintAPI';
import styles from './Theme.module.css';

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

  // 결과 요소들의 opacity를 위한 state 추가
  const [summaryOpacity, setSummaryOpacity] = useState(0);
  const [buttonsOpacity, setButtonsOpacity] = useState(0);

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
    
    // 선택될 인덱스 랜덤 결정
    const selectedThemeIndex = Math.floor(Math.random() * themes.length);
    const selectedConstraintIndex = Math.floor(Math.random() * constraints.length);
    
    // 초기에는 빠르게 돌다가 점점 느려지도록 시간 간격 설정
    // 더 많은 단계를 추가하여 총 회전 수 증가
    const intervals = [
      50, 50, 50, 50, 50, 50, 50, 50, 50, 50,  // 초반 10단계는 빠르게 (50ms)
      100, 100, 100, 100, 100,                // 중간 5단계는 보통 속도 (100ms)
      150, 150, 150,                          // 중간 후반 3단계 (150ms)
      200, 200, 250, 300, 350, 400            // 마지막 단계들은 점점 느리게
    ];
    let currentInterval = 0;
    
    // 슬롯 위치 변수 - 20바퀴 이상 돌도록 시작 위치 설정
    // 긴 회전을 위해 처음 위치를 랜덤하게 설정
    let themePos = Math.floor(Math.random() * themes.length);
    let constraintPos = Math.floor(Math.random() * constraints.length);
    
    const spin = () => {
      // 테마 위치 업데이트
      themePos = (themePos + 1) % themes.length;
      setThemePosition(themePos);
      
      // 제약 위치 업데이트
      constraintPos = (constraintPos + 1) % constraints.length;
      setConstraintPosition(constraintPos);
      
      // 다음 단계로 진행
      currentInterval++;
      
      // 더 많은 단계가 있으면 계속 진행
      if (currentInterval < intervals.length) {
        setTimeout(spin, intervals[currentInterval]);
      } else {
        // 모든 단계가 끝나면 최종 선택 위치로 설정
        setTimeout(() => {
          setThemePosition(selectedThemeIndex);
          setConstraintPosition(selectedConstraintIndex);
          setSelectedTheme(themes[selectedThemeIndex]);
          setSelectedConstraint(constraints[selectedConstraintIndex]);
          setSpinning(false);
        }, 500);
      }
    };
    
    // 첫 번째 단계 시작
    setTimeout(spin, intervals[0]);
  };

  const handleAccept = () => {
    if (selectedTheme && selectedConstraint && province && city) {
      navigate('/course', { 
        state: { 
          province: province,
          city: city,
          theme: selectedTheme,
          constraint: selectedConstraint
        }
      });
    }
  };

  // 결과가 선택되면 단계적으로 요소들을 표시
  useEffect(() => {
    // 슬롯 회전이 끝나고 결과가 선택되었을 때만 실행
    if (selectedTheme && selectedConstraint && !spinning) {
      // 모든 opacity 초기화
      setSummaryOpacity(0);
      setButtonsOpacity(0);
      
      // 결과 요약 텍스트 표시 (0.5초 후 시작)
      setTimeout(() => {
        let summaryValue = 0;
        const summaryInterval = setInterval(() => {
          summaryValue += 0.2;
          setSummaryOpacity(Math.min(summaryValue, 1));
          
          if (summaryValue >= 1) {
            clearInterval(summaryInterval);
            
            // 요약 텍스트 완전히 표시 후 0.3초 후에 버튼 표시 시작
            setTimeout(() => {
              let buttonsValue = 0;
              const buttonsInterval = setInterval(() => {
                buttonsValue += 0.2;
                setButtonsOpacity(Math.min(buttonsValue, 1));
                
                if (buttonsValue >= 1) {
                  clearInterval(buttonsInterval);
                }
              }, 200); // 0.2초마다 0.2씩 증가
            }, 300);
          }
        }, 200); // 0.2초마다 0.2씩 증가
      }, 500);
    }
  }, [selectedTheme, selectedConstraint, spinning]);

  if (isLoading) {
    return (
      <div className={styles.themeContainer}>
        <h1>{province?.name} {city?.name}</h1>
        <div className={styles.loading}>
          <p>테마 정보를 불러오는 중...</p>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.themeContainer}>
      <h1>{province?.name} {city?.name}</h1>
      
      {(themes.length === 0 || constraints.length === 0) ? (
        <div className={styles.errorMessage}>
          <p>테마 또는 제약 정보를 불러오는데 실패했습니다.</p>
        </div>
      ) : (
        <>
          <div className={styles.slotMachineContainer}>
            <div className={styles.slotMachineFrame}>
              <div className={styles.slotHeaderRow}>
                <div className={styles.slotHeader}>테마</div>
                <div className={styles.slotHeader}>조건</div>
              </div>
              <div className={styles.slotViewingArea}>
                {/* 테마 열 */}
                <div className={styles.slotColumn}>
                  <div 
                    className={styles.slotItems}
                    ref={themeSlotRef}
                    style={{ 
                      transform: `translateY(-${themePosition * 60}px)`,
                      transition: `transform ${spinning ? 0.2 : 0.5}s ease-out`
                    }}
                  >
                    {themes.map((theme, index) => (
                      <div 
                        key={theme.no} 
                        className={`${styles.slotItem} ${selectedTheme && selectedTheme.no === theme.no ? styles.selected : ''}`}
                      >
                        {theme.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 제약 열 */}
                <div className={styles.slotColumn}>
                  <div 
                    className={styles.slotItems}
                    ref={constraintSlotRef}
                    style={{ 
                      transform: `translateY(-${constraintPosition * 60}px)`,
                      transition: `transform ${spinning ? 0.2 : 0.5}s ease-out`
                    }}
                  >
                    {constraints.map((constraint, index) => (
                      <div 
                        key={constraint.no} 
                        className={`${styles.slotItem} ${selectedConstraint && selectedConstraint.no === constraint.no ? styles.selected : ''}`}
                      >
                        {constraint.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 선택 하이라이트 */}
                <div className={styles.slotHighlightRow}></div>
              </div>
              
              {/* 슬롯머신 레버 또는 버튼 */}
              <button
                className={styles.slotLever}
                onClick={startSpin}
                disabled={spinning || selectedTheme !== null}
              >
                {spinning ? '회전 중...' : (selectedTheme ? '레버 사용 완료' : '레버 당기기')}
              </button>
                        {/* 결과 컨테이너 - 항상 표시되도록 변경 */}
          <div className={styles.resultContainer}>
            <h2>🎉 선택된 테마와 제약 🎉</h2>
            
            {/* 결과 요약 - opacity로 단계적 표시 */}
            <div 
              className={styles.resultSummary}
              style={{ 
                opacity: summaryOpacity, 
                transition: 'opacity 0.2s ease',
                visibility: summaryOpacity > 0 ? 'visible' : 'hidden'
              }}
            >
              {selectedTheme && selectedConstraint && (
                <p>{province?.name} {city?.name}에서 <strong>{selectedTheme.name}</strong> 테마로 <strong>{selectedConstraint.name}</strong> 제약 조건으로 여행을 즐겨보세요!</p>
              )}
            </div>
            
            {/* 버튼 영역 - opacity로 단계적 표시 */}
            <div 
              className={styles.resultButtons}
              style={{ 
                opacity: buttonsOpacity, 
                transition: 'opacity 0.2s ease',
                visibility: buttonsOpacity > 0 ? 'visible' : 'hidden'
              }}
            >
              <button
                className={styles.acceptButton}
                onClick={handleAccept}
                disabled={buttonsOpacity < 1} // 완전히 표시되기 전까지 비활성화
              >
                결과 확인하기
              </button>
            </div>
          </div>
            </div>
            
          </div>
          
        </>
      )}
    </div>
  );
};

export default ThemeRandom; 