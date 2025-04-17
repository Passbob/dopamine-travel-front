import environment from '../../environments/environment';

/**
 * 총 방문자 수를 조회하는 API
 * @returns {Promise<number>} 총 방문자 수
 */
export const getTotalVisits = async () => {
  try {
    const url = `${environment.apiBaseUrl}${environment.endpoints.totalVisits}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API 요청 오류: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.code === "SUCCESS") {
      return result.data;
    } else {
      throw new Error(result.message || '데이터 조회 실패');
    }
    
  } catch (error) {
    console.error('방문자 수 조회 중 오류 발생:', error);
    if (environment.enableDebug) {
      console.debug('API 호출 상세 오류:', error);
    }
    // 오류 발생 시 기본값 반환 또는 재시도 로직을 추가할 수 있습니다.
    return 0;
  }
};

export default getTotalVisits;
