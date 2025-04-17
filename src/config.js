/**
 * 애플리케이션 환경 설정
 * process.env를 사용하면 빌드 시점에 환경 변수가 포함됩니다.
 * 개발 환경에서는 .env 파일을 통해 설정 가능합니다.
 */

// API 기본 URL 설정
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 기타 설정값
export const CONFIG = {
  // 추후 필요한 설정값 추가
}; 