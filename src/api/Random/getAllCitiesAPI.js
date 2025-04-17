import environment from '../../environments/environment';

/**
 * 특정 도(province)에 속한 도시(city) 목록을 가져오는 API
 * @param {number} provinceNo - 도 번호
 * @returns {Promise<Object>} 도시 목록 데이터
 */
export const getCitiesByProvince = async (provinceNo) => {
  try {
    // provinceNo 파라미터 검증
    if (!provinceNo) {
      throw new Error('provinceNo 파라미터가 필요합니다.');
    }
    
    const url = `${environment.apiBaseUrl}${environment.endpoints.prototypeCities}?provinceNo=${provinceNo}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API 요청 오류: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('도시 목록 가져오기 실패:', error);
    if (environment.enableDebug) {
      console.debug('API 호출 상세 오류:', error);
    }
    // 오류 발생 시 기본 반환값
    return { code: "ERROR", message: "데이터를 불러오는데 실패했습니다.", data: [] };
  }
};

export default getCitiesByProvince;