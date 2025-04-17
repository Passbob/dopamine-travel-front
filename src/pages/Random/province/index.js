import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProvinces } from '../../../api/Random/getAllProvinceAPI';
import './styles.css';

const ProvinceRoulette = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const result = await getAllProvinces();
        if (result.code === "SUCCESS") {
          setProvinces(result.data.map(province => ({
            option: province.name,
            provinceData: province
          })));
        }
        setLoading(false);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const handleSpinClick = () => {
    if (!mustSpin && !selectedProvince) {
      const newPrizeNumber = Math.floor(Math.random() * provinces.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setSelectedProvince(provinces[prizeNumber].provinceData);
  };

  const handleCitySelection = () => {
    if (selectedProvince) {
      navigate(`/random/city`, { state: { province: selectedProvince } });
    }
  };

  if (loading) {
    return (
      <div className="roulette-page">
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
    <div className="roulette-page">
      <div className="roulette-container">
        <motion.div 
          className="roulette-pointer"
          initial={{ y: -5 }}
          animate={{ y: 5 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        
        {provinces.length > 0 && (
          <div className="wheel-container">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={provinces}
              onStopSpinning={handleStopSpinning}
              backgroundColors={['#FF9D0A']}
              textColors={['#FFFFFF']}
              outerBorderColor={'#09A6FF'}
              outerBorderWidth={20}
              innerBorderColor={'#FFFFFF'}
              innerBorderWidth={10}
              radiusLineColor={'rgba(255, 255, 255, 0.2)'}
              radiusLineWidth={2}
              fontSize={22}
              perpendicularText={true}
              textDistance={85}
            />
            
            {!mustSpin && !selectedProvince && (
              <motion.button
                className="touch-button"
                onClick={handleSpinClick}
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
                TOUCH!
              </motion.button>
            )}
          </div>
        )}
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
            <h2>선택된 지역: {selectedProvince.name}</h2>
            <div className="button-group">
              <motion.button 
                className="accept-button"
                onClick={handleCitySelection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                도시 선택하기
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

export default ProvinceRoulette; 