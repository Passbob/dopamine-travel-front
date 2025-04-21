import environment from '../../environments/environment';

/**
 * 모든 테마 목록을 가져오는 API
 * @returns {Promise<Object>} 테마 목록 데이터
 */
export const getAllThemes = async () => {
  try {
    const url = `${environment.apiBaseUrl}${environment.endpoints.prototypeThemes}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API 요청 오류: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('테마 목록 가져오기 실패:', error);
    if (environment.enableDebug) {
      console.debug('API 호출 상세 오류:', error);
    }
    // 오류 발생 시 기본 반환값
    return { code: "ERROR", message: "데이터를 불러오는데 실패했습니다.", data: [] };
  }
};

export default getAllThemes; 