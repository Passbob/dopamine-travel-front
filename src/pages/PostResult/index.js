import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';
import SEO from '../../components/SEO';
import { getPageMetadata } from '../../utils/seoUtils';

const PostResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { province, city, theme, constraint, selectedCourseKey, courseData } = location.state || {};
  
  // 파라미터가 없을 때 기본값 설정 (SEO용)
  const defaultProvince = { name: '전국' };
  const defaultCity = { name: '여행지' };
  const defaultTheme = { name: '맞춤 테마' };
  const defaultConstraint = { name: '자유 여행' };
  
  const displayProvince = province || defaultProvince;
  const displayCity = city || defaultCity;
  const displayTheme = theme || defaultTheme;
  // displayConstraint는 사용하지 않으므로 제거
  
  // 선택된 코스 정보 가져오기
  const getCourseInfoArray = () => {
    const courses = [];
    
    // 선택한 코스 추가
    if (selectedCourseKey && courseData && courseData[selectedCourseKey]) {
      const selectedCourseInfo = typeof courseData[selectedCourseKey] === 'string'
        ? JSON.parse(courseData[selectedCourseKey])
        : courseData[selectedCourseKey];
        
      courses.push({
        order: 1,
        ...selectedCourseInfo
      });
    }
    
    // 나머지 코스 추가 (course1 ~ course6)
    for (let i = 1; i <= 6; i++) {
      const courseKey = `course${i}`;
      if (courseKey !== selectedCourseKey && courseData && courseData[courseKey]) {
        try {
          const courseInfo = typeof courseData[courseKey] === 'string'
            ? JSON.parse(courseData[courseKey])
            : courseData[courseKey];
            
          if (courseInfo.name) {
            courses.push({
              order: courses.length + 1,
              ...courseInfo
            });
          }
        } catch (e) {
          console.error(`코스 ${i} 파싱 오류:`, e);
        }
      }
    }
    
    return courses;
  };
  
  const courseInfoArray = getCourseInfoArray();
  
  // SEO 메타데이터 생성
  const seoMetadata = getPageMetadata('result', {
    destination: province && city ? {
      name: `${displayProvince.name} ${displayCity.name}`,
      description: `${displayTheme.name} 테마로 즐기는 ${displayProvince.name} ${displayCity.name} 여행`,
      region: displayProvince.name,
      city: displayCity.name,
      themes: [displayTheme.name]
    } : null
  });
  
  if (!province || !city || !theme || !constraint || !courseData) {
    return (
      <div className="result-container">
        <SEO
          title={seoMetadata.title}
          description={seoMetadata.description}
          keywords={seoMetadata.keywords}
          type={seoMetadata.type}
          structuredData={seoMetadata.structuredData}
        />
        
        <div className="result-header">
          <h1>🎉 여행 결과 페이지</h1>
          <p>AI가 추천하는 맞춤형 여행 코스를 확인하세요</p>
        </div>
        
        <div className="no-params-message">
          <h2>📋 여행 결과 서비스</h2>
          <p>선택하신 여행 코스의 상세 정보와 추천 장소들을 확인할 수 있습니다.</p>
          
          <div className="service-info">
            <div className="info-item">
              <h3>✨ 개인화된 추천</h3>
              <p>선택한 테마와 제약조건에 맞는 최적의 여행 코스</p>
            </div>
            <div className="info-item">
              <h3>📍 상세 정보</h3>
              <p>각 장소별 설명과 추천 이유 상세 제공</p>
            </div>
            <div className="info-item">
              <h3>💾 결과 저장</h3>
              <p>여행 계획을 복사하여 저장하고 공유</p>
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button onClick={() => navigate('/')}>홈으로 가기</button>
            <button onClick={() => navigate('/random')}>새 여행 계획하기</button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="result-container">
      <SEO
        title={seoMetadata.title}
        description={seoMetadata.description}
        keywords={seoMetadata.keywords}
        type={seoMetadata.type}
        structuredData={seoMetadata.structuredData}
      />
      
      <div className="result-header">
        <h1>{province.name} {city.name} 여행 코스</h1>
        <p>테마: {theme.name} / 제약: {constraint.name}</p>
      </div>
      
      <div className="course-list">
        <h2>추천 여행 코스</h2>
        {courseInfoArray.map((course, index) => (
          <div key={index} className="course-item">
            <div className="course-number">{course.order}</div>
            <div className="course-content">
              <h3>{course.name}</h3>
              <p>{course.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="result-actions">
        <button
          className="home-button"
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PostResult; 