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
// SEO 컴포넌트 가져오기
import SEO from '../../components/SEO';
// SEO 유틸리티 함수 가져오기
import { getPageMetadata } from '../../utils/seoUtils';

const Main = () => {
  // 방문자 수 상태 관리
  const [visitorCount, setVisitorCount] = useState(0);
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  // 공유 메뉴 상태 관리
  const [showShareMenu, setShowShareMenu] = useState(false);
  // 서버 점검 모달 상태 관리
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(true);
  
  // SEO 메타데이터 생성
  const seoMetadata = getPageMetadata('home', { visitorCount });

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
      {/* 서버 점검 모달 */}
      {showMaintenanceModal && (
        <div className="maintenance-modal-overlay" onClick={() => setShowMaintenanceModal(false)}>
          <motion.div 
            className="maintenance-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="maintenance-modal-header">
              <h2>🔧 서버 점검 안내</h2>
              <button 
                className="maintenance-modal-close"
                onClick={() => setShowMaintenanceModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="maintenance-modal-content">
              <p className="maintenance-message">
                현재 서버 이전으로 인해<br />
                일시적으로 운영이 중단되었습니다.
              </p>
              <p className="maintenance-date">
                이전 기간: ~26.01.07
              </p>
              <p className="maintenance-apology">
                불편을 드려 죄송합니다.<br />
                빠른 시일 내에 정상화되도록 노력하겠습니다.
              </p>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* SEO를 위한 정적 HTML 구조 (JS 없이도 보임) */}
      <div className="seo-content" style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}>
        <h1>도파민 여행 - AI 추천 기반 랜덤 여행지 생성 서비스</h1>
        <h2>여행지 선택 고민 해결 서비스</h2>
        <h3>AI 추천 랜덤 여행</h3>
        <h3>지역별 랜덤 여행</h3>
        <h3>테마별 랜덤 여행</h3>
        <p>여행지 아직도 못 고르셨나요? AI추천 기반으로 랜덤 여행지를 정해보세요</p>
        <p>도파민과 함께 여행을 떠난 트레블러들이 이용하는 서비스입니다.</p>
        <nav>
          <a href="/random">지역별 랜덤 여행</a>
          <a href="/random/city">도시별 랜덤 여행</a>
          <a href="/random/theme">테마별 랜덤 여행</a>
        </nav>
      </div>
      
      <SEO 
        title={seoMetadata.title}
        description={seoMetadata.description}
        keywords={seoMetadata.keywords}
        type={seoMetadata.type}
        structuredData={seoMetadata.structuredData}
      />
      <div className="main-content">
        <motion.h1 
          className="main-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          도파민 여행
        </motion.h1>
        
        <motion.h2 
          className="main-subtitle"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          AI 추천 기반 랜덤 여행지 생성 서비스
        </motion.h2>
        
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
      
      {/* 드롭다운 공유 버튼 */}
      <motion.div 
        className="share-section"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.4
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="share-dropdown">
          <button className="share-btn" onClick={() => setShowShareMenu(!showShareMenu)}>
            <span className="share-icon">📤</span>
            <span className="share-text">공유</span>
          </button>
          
          {showShareMenu && (
            <motion.div 
              className="share-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button 
                className="share-option facebook"
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent('도파민 여행 - AI 추천 랜덤 여행지');
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
                }}
              >
                <span className="share-option-icon">📘</span>
                <span>Facebook</span>
              </button>
              
              <button 
                className="share-option twitter"
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent('도파민 여행 - AI 추천 랜덤 여행지 🚀');
                  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                }}
              >
                <span className="share-option-icon">🐦</span>
                <span>Twitter</span>
              </button>
              
              <button 
                className="share-option kakao"
                onClick={() => {
                  if (window.Kakao) {
                    window.Kakao.Link.sendDefault({
                      objectType: 'feed',
                      content: {
                        title: '도파민 여행 - AI 추천 랜덤 여행지',
                        description: '여행지 고민 끝! AI가 추천하는 랜덤 여행지를 발견하세요',
                        imageUrl: `${window.location.origin}/web-app-manifest-512x512.png`,
                        link: {
                          mobileWebUrl: window.location.href,
                          webUrl: window.location.href,
                        },
                      },
                      buttons: [
                        {
                          title: '여행 시작하기',
                          link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                          },
                        },
                      ],
                    });
                  } else {
                    alert('카카오톡 공유를 위해 카카오 SDK를 로드해주세요.');
                  }
                }}
              >
                <span className="share-option-icon">💬</span>
                <span>KakaoTalk</span>
              </button>
              
              <button 
                className="share-option copy"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('링크가 복사되었습니다!');
                }}
              >
                <span className="share-icon">🔗</span>
                <span>링크 복사</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="inquiry-button"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.6
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="inquiry-icon">?</div>
        <span className="share-text">문의</span>
      </motion.div>
      
      {/* 추가 내부 링크 섹션 */}
      <motion.div 
        className="internal-links-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <h2>🚀 더 많은 여행 옵션</h2>
        <div className="internal-links-grid">
          <Link to="/random" className="internal-link">
            <h3>🎯 지역별 랜덤 여행</h3>
            <p>전국 지역에서 랜덤으로 여행지 선택</p>
          </Link>
          {/* <Link to="/random/city" className="internal-link">
            <h3>🏙️ 도시별 랜덤 여행</h3>
            <p>도시별로 세분화된 랜덤 여행지</p>
          </Link>
          <Link to="/random/theme" className="internal-link">
            <h3>🎨 테마별 랜덤 여행</h3>
            <p>자연, 문화, 맛집 등 테마별 여행</p>
          </Link> */}
        </div>
      </motion.div>
    </div>
  );
};

export default Main; 