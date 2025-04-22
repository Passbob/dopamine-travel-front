import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.css';

const PostResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { province, city, theme, constraint, selectedCourseKey, courseData } = location.state || {};
  
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
  
  if (!province || !city || !theme || !constraint || !courseData) {
    return (
      <div className="result-container">
        <h1>오류 발생</h1>
        <div className="error-message">
          <p>필요한 정보가 부족합니다.</p>
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="result-container">
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