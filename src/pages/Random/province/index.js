import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { getAllProvinces } from '../../../api/Random/getAllProvinceAPI';
import koreaMap from '../../../assets/korea-map.png'; // 한국 지도 이미지 경로 수정 필요
import './styles.css';

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
  const navigate = useNavigate();

  // 각 도/광역시별 대략적인 좌표 (지도 이미지에 맞게 조정 필요)
  const provinceCoordinates = {
    1: { x: -40, y: -120 },  // 경기도
    2: { x: 50, y: -140 },  // 강원도
    3: { x: -20, y: -40 },  // 충청북도
    4: { x: -100, y: -20 },  // 충청남도
    5: { x: -80, y: 40 },  // 전라북도
    6: { x: -90, y: 140 },  // 전라남도
    7: { x: 100, y: -10 },  // 경상북도
    8: { x: 30, y: 100 },  // 경상남도
    9: { x: -70, y: -148 }, // 서울특별시
    10: { x: -80, y: 200 },  // 제주특별자치도
  };

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
      
      // 스포트라이트 애니메이션 실제 시간 계산 (ms)
      const steps = 10; // 몇 개의 랜덤 위치를 방문할지
      let totalSpotlightTime = 0;
      
      // 각 단계별 시간 계산 (점점 빨라지는 효과 고려)
      for (let i = 0; i < steps; i++) {
        totalSpotlightTime += (0.5 - (i * 0.04)) * 1000;
      }
      
      // 마지막 단계 시간 추가
      totalSpotlightTime += 800; // 마지막 단계 0.8초
      
      console.log('총 애니메이션 예상 시간:', totalSpotlightTime, 'ms');
      
      const updateFrequency = 200; // 200ms마다 업데이트
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

      // 스포트라이트가 여러 지역을 돌아다니는 애니메이션
      for (let i = 0; i < steps; i++) {
        const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
        const coords = provinceCoordinates[randomProvince.no] || { x: 0, y: 0 };
        
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
      const finalCoords = provinceCoordinates[finalProvince.no] || { x: 200, y: 200 };
      
      // 마지막 위치로 이동하고 좀 더 밝게
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
      
      // 애니메이션 종료 시 진행 바 100%로 설정 (아직 끝나지 않았을 경우)
      setSearchProgress(100);
      clearInterval(progressInterval);
    }
  };

  const handleCitySelection = () => {
    if (selectedProvince) {
      navigate(`/random/city`, { 
        state: { 
          province: selectedProvince  // 전체 province 객체를 state로 전달
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="map-page">
        <div className="loading-container">
          <motion.div
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-container" ref={mapRef}>
        {/* 한국 지도 */}
        <div className="korea-map-wrapper">
          <img src={koreaMap} alt="대한민국 지도" className="korea-map" />
          
          {/* 스포트라이트 효과 */}
          <motion.div 
            className="spotlight"
            initial={{ x: 0, y: 0, boxShadow: "0 0 60px 30px rgba(255, 255, 255, 0.6)" }}
            animate={spotlightControls}
          />
          
          {/* 지역 검색 중 상태 표시 */}
          {isSearching && (
            <div className="search-status">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${searchProgress}%` }}
                ></div>
              </div>
              <p>지역 검색 중... {searchProgress}%</p>
            </div>
          )}
          
          {/* 시작 버튼 */}
          {!isSearching && !selectedProvince && (
            <motion.button
              className="start-search-button"
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
            className="result-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2>🎉 선택된 지역: {selectedProvince.name} 🎉</h2>
            <div className="button-group">
              <motion.button 
                className="accept-button"
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

      <div className="navigation">
        <Link to="/" className="home-link">홈으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default ProvinceSpotlight; 