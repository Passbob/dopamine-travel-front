/**
 * 개발 환경을 위한 기본 환경 설정
 * 다른 환경 설정도 추가할 수 있습니다. (예: environment.prod.js)
 * 빌드 과정에서 환경에 맞는 파일로 대체할 수 있습니다.
 */

// 런타임 환경 감지
const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.REACT_APP_ENV === 'staging';

// 환경별 설정
const environment = {
  production: {
    apiBaseUrl: 'https://api.도파민여행.com', // 실제 도메인으로 변경 필요
    enableDebug: false,
  },
  staging: {
    apiBaseUrl: 'https://staging-api.도파민여행.com', // 스테이징 도메인으로 변경 필요
    enableDebug: true,
  },
  development: {
    apiBaseUrl: 'http://localhost:8080',
    enableDebug: true,
  }
};

// 현재 환경에 맞는 설정 선택
const currentEnv = isProduction ? 'production' : (isStaging ? 'staging' : 'development');
const config = environment[currentEnv];

export default {
  apiBaseUrl: config.apiBaseUrl,
  enableDebug: config.enableDebug,
  
  // API 엔드포인트들
  endpoints: {
    totalVisits: '/api/total-visits',
    prototypeCities: '/api/prototype/cities',
    prototypeProvinces: '/api/prototype/provinces',
  }
}; 