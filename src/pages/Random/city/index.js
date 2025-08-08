import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCitiesByProvince } from '../../../api/Random/getAllCitiesAPI';
import styles from './City.module.css';
import SEO from '../../../components/SEO';
import { getPageMetadata } from '../../../utils/seoUtils';

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
  
  // 파라미터가 없을 때 기본값 설정 (SEO용)
  const defaultProvince = { name: '전국' };
  const displayProvince = province || defaultProvince;
  
  // SEO 메타데이터 생성
  const seoMetadata = getPageMetadata('random-city', { 
    province: displayProvince.name
  });

  useEffect(() => {
    const fetchCities = async () => {
      // 쿼리스트링의 provinceNo 우선 사용, 없으면 state 객체에서 가져옴
      const targetProvinceNo = provinceNo || province?.no;
      
      if (!targetProvinceNo) {
        // 파라미터가 없을 때는 로딩만 종료하고 공갈 페이지 표시
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
    // 화살표 위치(0도, 상단)에 선택된 도시가 오도록 조정
    // 90도를 더해서 화살표(상단)에 도시가 오도록 함
    const adjustedRotation = baseRotation - selectedAngle;
    
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
        // 각 섹션당 각도 계산
        const sectionAngle = 360 / total;
        // 각 도시 항목의 각도 계산 (0도부터 시작하여 시계 방향으로 배치)
        // 각 섹션의 중앙에 선이 오도록 섹션 각도의 절반만큼 오프셋 추가
        const angle2 = (index / total) * 360 + (sectionAngle / 2);

    // 텍스트가 중앙에서 바깥쪽으로 향하도록 90도 회전 추가하고,
    // 텍스트를 올바른 방향으로 표시하기 위해 180도 추가 회전
    const rotate = `rotate(${angle2}deg) rotate(-90deg)`;
    return { transform: `${rotate} translateY(-50%)` };
  };

    // 룰렛에 표시할 도시들 이름의 각도 계산
    const getCitySpanStyles = (index, total) => {
      // 각 섹션당 각도 계산
      const sectionAngle = 360 / total;
      // 각 도시 항목의 각도 계산 (0도부터 시작하여 시계 방향으로 배치)
      // 각 섹션의 중앙에 선이 오도록 섹션 각도의 절반만큼 오프셋 추가
      const angle2 = (index / total) * 360 + (sectionAngle / 2);
  // 텍스트가 중앙에서 바깥쪽으로 향하도록 90도 회전 추가하고,
  // 텍스트를 올바른 방향으로 표시하기 위해 180도 추가 회전
  const rotate = `rotate(${angle2}deg)`;
  return { transform: `${rotate} translateY(-50%)` };
};

  // 페이지 타이틀에 지역 이름 표시
  const provinceName = displayProvince.name;

  if (isLoading) {
    return (
      <div className={styles.randomContainer}>
          <SEO
            title={seoMetadata.title}
            description={seoMetadata.description}
            keywords={seoMetadata.keywords}
            type={seoMetadata.type}
            structuredData={seoMetadata.structuredData}
          />
        <h1>{provinceName} 도시 랜덤 선택</h1>
        <div className={styles.loading}>
          <p>도시 정보를 불러오는 중...</p>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.randomContainer}>
      <SEO 
        title={seoMetadata.title}
        description={seoMetadata.description}
        keywords={seoMetadata.keywords}
        type={seoMetadata.type}
        structuredData={seoMetadata.structuredData}
      />
      <h1>{provinceName} 도시 랜덤 선택</h1>
      
      {/* 파라미터가 없을 때 안내 메시지 */}
      {!provinceNo && !province ? (
        <div className={styles.noParamsMessage}>
          <h2>🎲 도시별 랜덤 여행</h2>
          <p>전국 도시 중에서 랜덤으로 여행지를 골라보세요!</p>
          <p>새로운 도시에서의 특별한 경험을 만나보세요.</p>
          
          <div className={styles.serviceFeatures}>
            <div className={styles.feature}>
              <h3>🎯 룰렛 방식</h3>
              <p>재미있는 룰렛으로 운명의 도시 선택</p>
            </div>
            <div className={styles.feature}>
              <h3>🏙️ 다양한 도시</h3>
              <p>각 지역별 특색있는 도시들 중 랜덤 선택</p>
            </div>
            <div className={styles.feature}>
              <h3>🗺️ 즉시 연결</h3>
              <p>선택 후 바로 테마 선택으로 연결</p>
            </div>
          </div>
          
          <div className={styles.navigationButtons}>
            <button onClick={() => navigate('/')}>홈으로 가기</button>
            <button onClick={() => navigate('/random')}>지역 선택하기</button>
          </div>
          
          {/* 도시 예시 */}
          <div className={styles.cityPreview}>
            <h3>🌟 이런 도시들이 기다리고 있어요</h3>
            <div className={styles.cityExamples}>
              <span className={styles.cityTag}>서울</span>
              <span className={styles.cityTag}>부산</span>
              <span className={styles.cityTag}>제주</span>
              <span className={styles.cityTag}>강릉</span>
              <span className={styles.cityTag}>경주</span>
              <span className={styles.cityTag}>전주</span>
              <span className={styles.cityTag}>그 외 많은 도시들...</span>
            </div>
          </div>
        </div>
      ) : cities.length === 0 ? (
        <div className={styles.errorMessage}>
          <p>도시 정보를 불러오는데 실패했습니다.</p>
          <div className={styles.navigationButtons}>
            <button onClick={() => navigate('/')}>홈으로 가기</button>
            <button onClick={() => navigate('/random')}>다시 선택하기</button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.rouletteContainer}>
            {/* 회전 마커 */}
            <div className={styles.rouletteMarker}></div>
            
            {/* 룰렛 */}
            <motion.div
              className={styles.rouletteWheel}
              ref={rouletteRef}
              animate={{ rotate: rotationDegree }}
              transition={{
                duration: 5,
                ease: [0.2, 0.9, 0.3, 0.99],
              }}
            >
              {cities.map((city, index) => (
                <div
                  key={city.no}
                  className={styles.rouletteItem}
                  style={getCityStyles(index, cities.length)}
                >
                  <span>{city.name}</span>
                </div>
              ))}
            </motion.div>
            <div className={styles.buttonContainer}>
              {!selectedCity && (<button
                className={styles.spinButtonCustom}
                onClick={startSpin}
                disabled={spinning}
              >
                {spinning ? '돌아가는 중...' : '룰렛 돌리기'}
              </button>)}
              <AnimatePresence>
            {selectedCity && !spinning && (
              <motion.div
                className={styles.resultContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', zIndex: 2000, pointerEvents: 'auto' }}
              >
                <h2>🎉 선택된 도시: {selectedCity.name} 🎉</h2>
                <p>{selectedCity.description || `${province?.name}의 멋진 도시입니다.`}</p>
                <div className={styles.resultButtons}>
                  <button
                    className={styles.acceptButton}
                    onClick={handleAccept}
                  >
                    테마 랜덤
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default Random; 