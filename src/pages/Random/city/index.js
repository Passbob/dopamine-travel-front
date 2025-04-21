import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCitiesByProvince } from '../../../api/Random/getAllCitiesAPI';
import './styles.css';

const Random = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [searchParams] = useSearchParams();
  const rouletteRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 provinceNo 파라미터 가져오기
  const provinceNo = searchParams.get('provinceNo');
  // location.state에서 province 정보 가져오기 (이전 방식과의 호환성 유지)
  const province = location.state?.province;

  useEffect(() => {
    const fetchCities = async () => {
      // 쿼리스트링의 provinceNo 우선 사용, 없으면 state 객체에서 가져옴
      const targetProvinceNo = provinceNo || province?.no;
      
      if (!targetProvinceNo) {
        console.error('provinceNo가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        const result = await getCitiesByProvince(targetProvinceNo);
        if (result.code === "SUCCESS" && result.data && result.data.length > 0) {
          setCities(result.data);
        } else {
          console.error('도시 데이터를 불러오는데 실패했습니다:', result.message);
        }
      } catch (error) {
        console.error('API 호출 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [provinceNo, province]);

  const startSpin = () => {
    if (spinning || cities.length === 0) return;
    
    setSpinning(true);
    setSelectedCity(null);
    
    // 회전 각도 계산 (5-10회전 + 랜덤한 위치에서 멈춤)
    const minSpins = 5;
    const maxSpins = 10;
    const spins = Math.floor(Math.random() * (maxSpins - minSpins) + minSpins);
    const baseRotation = spins * 360;
    
    // 멈출 도시 랜덤 선택
    const selectedIndex = Math.floor(Math.random() * cities.length);
    const selectedAngle = (selectedIndex / cities.length) * 360;
    
    // 룰렛이 선택된 도시에서 정확히 멈추도록 각도 조정
    // 룰렛 위치 = 전체 회전 + 마커 위치 - 선택된 도시의 각도
    const adjustedRotation = baseRotation + (360 - selectedAngle);
    
    setRotationDegree(adjustedRotation);
    
    // 애니메이션 종료 후 결과 표시
    setTimeout(() => {
      setSpinning(false);
      setSelectedCity(cities[selectedIndex]);
    }, 5000); // 애니메이션 시간과 동일하게 설정
  };

  const handleAccept = () => {
    if (selectedCity) {
      navigate('/random/theme', { 
        state: { 
          province: {
            no: provinceNo || province?.no,
            name: provinceName
          },
          city: selectedCity 
        }
      });
    }
  };

  // 룰렛에 표시할 도시들의 각도 계산
  const getCityStyles = (index, total) => {
    const angle = (index / total) * 360;
    const rotate = `rotate(${angle}deg)`;
    return { transform: `${rotate} translateY(-50%)` };
  };

  // 페이지 타이틀에 지역 이름 표시 (provinceNo만 있고 province 객체가 없는 경우 대비)
  const provinceName = province?.name || '선택한 지역';

  if (isLoading) {
    return (
      <div className="random-container">
        <h1>{provinceName} 도시 랜덤 선택</h1>
        <div className="loading">
          <p>도시 정보를 불러오는 중...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="random-container">
      <h1>{provinceName} 도시 랜덤 선택</h1>
      
      {cities.length === 0 ? (
        <div className="error-message">
          <p>도시 정보를 불러오는데 실패했습니다.</p>
        </div>
      ) : (
        <>
          <div className="roulette-container">
            {/* 회전 마커 */}
            <div className="roulette-marker"></div>
            
            {/* 룰렛 */}
            <motion.div
              className="roulette-wheel"
              ref={rouletteRef}
              animate={{ rotate: rotationDegree }}
              transition={{
                duration: 5,
                ease: [0.2, 0.9, 0.3, 0.99], // 빠르게 시작하여 천천히 멈추는 효과
              }}
            >
              {cities.map((city, index) => (
                <div
                  key={city.no}
                  className="roulette-item"
                  style={getCityStyles(index, cities.length)}
                >
                  <span>{city.name}</span>
                </div>
              ))}
            </motion.div>
            
            <button
              className="spin-button"
              onClick={startSpin}
              disabled={spinning}
            >
              {spinning ? '돌아가는 중...' : '룰렛 돌리기'}
            </button>
          </div>

          <AnimatePresence>
            {selectedCity && !spinning && (
              <motion.div
                className="result-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>🎉 선택된 도시: {selectedCity.name} 🎉</h2>
                <p>{selectedCity.description || `${province?.name}의 멋진 도시입니다.`}</p>
                <div className="result-buttons">
                  <button
                    className="accept-button"
                    onClick={handleAccept}
                  >
                    테마 랜덤
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

export default Random; 