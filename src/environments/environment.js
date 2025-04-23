/**
 * 개발 환경을 위한 기본 환경 설정
 * 다른 환경 설정도 추가할 수 있습니다. (예: environment.prod.js)
 * 빌드 과정에서 환경에 맞는 파일로 대체할 수 있습니다.
 */

// 런타임 환경 감지
const isProduction = process.env.NODE_ENV === 'production';

// CI/CD에서 설정된 환경 변수 사용
const apiBaseUrlFromEnv = process.env.REACT_APP_API_URL;

// 환경별 설정
const environment = {
  production: {
    // CI/CD 환경 변수가 있으면 사용, 없으면 기본값 사용
    apiBaseUrl: apiBaseUrlFromEnv || 'http://3.37.225.55:8080',
    enableDebug: false,
  },
  development: {
    apiBaseUrl: 'http://localhost:8080',
    enableDebug: true,
  }
};

// 현재 환경에 맞는 설정 선택
const currentEnv = isProduction ? 'production' : 'development';
const config = environment[currentEnv];

export default {
  apiBaseUrl: config.apiBaseUrl,
  enableDebug: config.enableDebug,
  
  // API 엔드포인트들
  endpoints: {
    totalVisits: '/api/total-visits',
    prototypeCities: '/api/prototype/cities',
    prototypeProvinces: '/api/prototype/provinces',
    prototypeThemes: '/api/prototype/themes',
    prototypeConstraints: '/api/prototype/constraints',
    prototypeTravelCourse: '/api/prototype/travel-course',
  }
}; 