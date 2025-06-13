import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { getAllProvinces } from '../../../api/Random/getAllProvinceAPI';
import koreaMap from '../../../assets/korea-map.png'; // 한국 지도 이미지 경로 수정 필요
import styles from './Province.module.css';
import SEO from '../../../components/SEO';

// framer-motion 주요 속성 설명
// initial: 애니메이션 시작 전 초기 상태 (opacity, scale, position 등)
// animate: 요소가 표시될 때의 최종 상태
// exit: 요소가 사라질 때의 상태
// transition: 애니메이션 타이밍 설정
//   - duration: 애니메이션 지속 시간(초)
//   - delay: 시작 전 지연 시간
//   - repeat: 반복 횟수 (Infinity는 무한 반복)
//   - repeatType: "loop"(처음부터), "reverse"(왕복), "mirror"(왕복 부드럽게)
//   - ease: 가속도 곡선 ("linear", "easeIn", "easeOut", "easeInOut" 등)
//   - type: 애니메이션 타입 ("tween"=일반, "spring"=탄성효과)
//   - stiffness: 스프링 강성 (높을수록 빠르게 움직임)
//   - damping: 스프링 감쇠 (높을수록 빨리 멈춤)

const ProvinceSpotlight = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const spotlightControls = useAnimation();
  const mapRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 600, height: 600 });
  const navigate = useNavigate();

  // 각 도/광역시별 상대적 좌표 (퍼센트 기준)
  const provinceRelativeCoordinates = {
    1: { x: -6.7, y: -21.5 },   // 경기도 (중앙에서 약간 왼쪽, 위쪽)
    2: { x: 9.3, y: -26.3 },  // 강원도 (중앙에서 약간 오른쪽, 더 위쪽)
    3: { x: -3.3, y: -6.7 },  // 충청북도 (중앙에서 약간 왼쪽)
    4: { x: -16.7, y: -3.3 }, // 충청남도 (왼쪽, 중앙 약간 위)
    5: { x: -13.3, y: 6.7 },  // 전라북도 (왼쪽, 중앙 약간 아래)
    6: { x: -15, y: 23.3 },   // 전라남도 (왼쪽, 아래)
    7: { x: 16.7, y: -1.7 },  // 경상북도 (오른쪽, 중앙)
    8: { x: 5, y: 16.7 },     // 경상남도 (약간 오른쪽, 아래)
    9: { x: -12.7, y: -27.5 },// 서울특별시 (왼쪽, 위)
    10: { x: -14.3, y: 44.3 } // 제주특별자치도 (왼쪽, 맨 아래)
  };

  // 상대적 좌표를 실제 픽셀 값으로 변환하는 함수
  const getProvinceCoordinates = (provinceNo) => {
    const relCoords = provinceRelativeCoordinates[provinceNo];
    if (!relCoords) return { x: 0, y: 0 };

    // 지도 컨테이너의 중심을 기준으로 상대 좌표 계산
    return {
      x: (relCoords.x / 100) * mapDimensions.width,
      y: (relCoords.y / 100) * mapDimensions.height
    };
  };

  // 지도 크기 업데이트 함수
  const updateMapDimensions = () => {
    if (mapRef.current) {
      const { width, height } = mapRef.current.getBoundingClientRect();
      setMapDimensions({ width, height });
    }
  };

  // 컴포넌트 마운트 시 및 창 크기 변경 시 지도 크기 업데이트
  useEffect(() => {
    updateMapDimensions();
    
    const handleResize = () => {
      updateMapDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const result = await getAllProvinces();
        if (result.code === "SUCCESS") {
          setProvinces(result.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const startSpotlightAnimation = async () => {
    if (!isSearching && !selectedProvince && provinces.length > 0) {
      setIsSearching(true);
      
      // 애니메이션 실제 시간 계산 (ms)
      const steps = 10; // 방문할 랜덤 위치 수
      let totalSpotlightTime = 0;
      
      // 각 단계별 시간 계산
      for (let i = 0; i < steps; i++) {
        totalSpotlightTime += (0.5 - (i * 0.04)) * 1000;
      }
      
      // 마지막 단계 시간 추가
      totalSpotlightTime += 800;
      
      // 진행률 업데이트 빈도
      const updateFrequency = 200;
      const incrementAmount = 100 / (totalSpotlightTime / updateFrequency);
      
      // 진행률 애니메이션
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += incrementAmount;
        setSearchProgress(Math.min(Math.round(progress), 100));
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, updateFrequency);

      // 여러 지역을 방문하는 애니메이션
      for (let i = 0; i < steps; i++) {
        const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
        const coords = getProvinceCoordinates(randomProvince.no);
        
        await spotlightControls.start({
          x: coords.x,
          y: coords.y,
          transition: { 
            duration: 0.5 - (i * 0.04), // 점점 빨라짐
            ease: "easeInOut"
          }
        });
      }
      
      // 최종 선택된 지역
      const selectedIndex = Math.floor(Math.random() * provinces.length);
      const finalProvince = provinces[selectedIndex];
      const finalCoords = getProvinceCoordinates(finalProvince.no);
      
      // 마지막 위치로 이동
      await spotlightControls.start({
        x: finalCoords.x,
        y: finalCoords.y,
        boxShadow: "0 0 80px 40px rgba(255, 255, 255, 0.8)",
        transition: { 
          duration: 0.8,
          ease: "easeOut"
        }
      });

      // 선택 완료
      setSelectedProvince(finalProvince);
      setIsSearching(false);
      
      // 진행 바 완료
      setSearchProgress(100);
      clearInterval(progressInterval);
    }
  };

  const handleCitySelection = () => {
    if (selectedProvince) {
      navigate(`/random/city`, { 
        state: { 
          province: selectedProvince
        }
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.mapPage}>
          <SEO
            title="도 선택"
            description="여행하고 싶은 도를 선택하세요. 경기도, 강원도, 제주도 등 전국 여행지 중에서 랜덤으로 추천해드립니다."
            keywords="도 선택, 여행지 선택, 경기도 여행, 강원도 여행, 제주도 여행, 랜덤 여행, 국내여행"
          />
        <div className={styles.loadingContainer}>
          <motion.div
            className={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapPage}>
        <SEO
          title="도 선택"
          description="여행하고 싶은 도를 선택하세요. 경기도, 강원도, 제주도 등 전국 여행지 중에서 랜덤으로 추천해드립니다."
          keywords="도 선택, 여행지 선택, 경기도 여행, 강원도 여행, 제주도 여행, 랜덤 여행, 국내여행"
        />
      <div className={styles.mapContainer}>
        {/* 한국 지도 */}
        <div className={styles.koreaMapWrapper} ref={mapRef}>
          <img src={koreaMap} alt="대한민국 지도" className={styles.koreaMap} />
          
          {/* 스포트라이트 효과 */}
          <motion.div 
            className={styles.spotlight}
            initial={{ x: 0, y: 0, boxShadow: "0 0 60px 30px rgba(255, 255, 255, 0.6)" }}
            animate={spotlightControls}
          />
          
          {/* 지역 검색 중 상태 표시 */}
          {isSearching && (
            <div className={styles.searchStatus}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${searchProgress}%` }}
                ></div>
              </div>
              <p>지역 검색 중... {searchProgress}%</p>
            </div>
          )}
          
          {/* 시작 버튼 */}
          {!isSearching && !selectedProvince && (
            <motion.button
              className={styles.startSearchButton}
              onClick={startSpotlightAnimation}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0px 0px 0px rgba(255, 255, 255, 0.5)",
                  "0px 0px 20px rgba(255, 255, 255, 0.5)",
                  "0px 0px 0px rgba(255, 255, 255, 0.5)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              여행지 찾기
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProvince && (
          <motion.div 
            className={styles.resultContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2>🎉 선택된 지역: {selectedProvince.name} 🎉</h2>
            <div className={styles.buttonGroup}>
              <motion.button 
                className={styles.acceptButton}
                onClick={handleCitySelection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                도시 랜덤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.navigation}>
        <Link to="/" className={styles.homeLink}>홈으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default ProvinceSpotlight; 