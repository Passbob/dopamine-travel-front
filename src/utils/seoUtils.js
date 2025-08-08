/**
 * SEO 관련 유틸리티 함수들
 */

// 여행지 관련 구조화된 데이터 생성
export const createTravelDestinationSchema = (destination) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": destination.name,
    "description": destination.description,
    "image": destination.image,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR",
      "addressRegion": destination.region,
      "addressLocality": destination.city
    },
    "geo": destination.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": destination.coordinates.lat,
      "longitude": destination.coordinates.lng
    } : undefined,
    "touristType": destination.themes || [],
    "isAccessibleForFree": destination.isFree || false
  };
};

// 여행 코스 관련 구조화된 데이터 생성
export const createTravelItinerarySchema = (itinerary) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": itinerary.title,
    "description": itinerary.description,
    "itinerary": itinerary.places.map((place, index) => ({
      "@type": "TouristDestination",
      "name": place.name,
      "description": place.description,
      "position": index + 1
    })),
    "duration": itinerary.duration,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "description": "무료 여행 코스 추천"
    }
  };
};

// 랜덤 여행 서비스 스키마
export const createRandomTravelServiceSchema = (serviceType) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "도파민 여행 - 랜덤 여행 추천",
    "description": "AI 기반 랜덤 여행지 추천 서비스",
    "provider": {
      "@type": "Organization",
      "name": "도파민 여행"
    },
    "serviceType": "여행 추천",
    "areaServed": "대한민국",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    }
  };

  // 서비스 타입에 따른 추가 정보
  switch (serviceType) {
    case 'city':
      return {
        ...baseSchema,
        "name": "도파민 여행 - 랜덤 도시 추천",
        "description": "전국 도시 중에서 랜덤으로 여행지를 추천해드립니다",
        "serviceOutput": "도시 여행지 추천"
      };
    case 'theme':
      return {
        ...baseSchema,
        "name": "도파민 여행 - 테마별 랜덤 여행",
        "description": "다양한 테마로 분류된 랜덤 여행지를 추천해드립니다",
        "serviceOutput": "테마별 여행지 추천"
      };
    case 'province':
      return {
        ...baseSchema,
        "name": "도파민 여행 - 지역별 랜덤 여행",
        "description": "전국 지역별로 랜덤 여행지를 추천해드립니다",
        "serviceOutput": "지역별 여행지 추천"
      };
    default:
      return baseSchema;
  }
};

// FAQ 스키마 생성
export const createFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// 브레드크럼 스키마 생성
export const createBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// 웹사이트 기본 스키마
export const createWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "도파민 여행",
    "url": "https://randomdopamine.shop",
    "description": "AI 추천 기반 랜덤 여행지 생성 서비스",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://randomdopamine.shop/random?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Organization",
      "name": "도파민 여행"
    }
  };
};

// 페이지별 메타 데이터 생성
export const getPageMetadata = (pageType, data = {}) => {
  const baseMetadata = {
    title: '도파민 여행',
    description: 'AI 추천 기반 랜덤 여행지 생성 서비스. 어디로 갈지 고민될 때, 도파민과 함께 새로운 여행지를 발견하세요.',
    keywords: '여행, 랜덤 여행, 여행지 추천, 도파민 여행, 국내여행, AI 추천',
    type: 'website'
  };

  switch (pageType) {
    case 'home':
      return {
        ...baseMetadata,
        title: '홈',
        description: '랜덤 여행지 추천 - 도파민 여행 - AI 추천 기반 랜덤 여행지 생성 서비스. 어디로 갈지 고민될 때, 도파민과 함께 새로운 여행지를 발견하세요.',
        keywords: '여행, 랜덤 여행, 여행지 추천, 도파민 여행, 국내여행, AI 추천, 여행추천, 랜덤여행',
        structuredData: createWebsiteSchema()
      };
    
    case 'random':
      return {
        ...baseMetadata,
        title: '랜덤 여행',
        description: '전국 어디든 랜덤으로 여행지를 추천받아보세요. 선택장애 없이 즉석에서 결정하는 새로운 여행 경험!',
        keywords: '랜덤여행, 여행추천, 선택장애, 즉흥여행, 전국여행, 랜덤 여행지',
        structuredData: createRandomTravelServiceSchema('province')
      };
    
    case 'random-city':
      return {
        ...baseMetadata,
        title: '랜덤 도시 여행',
        description: '전국 도시 중에서 랜덤으로 여행지를 골라보세요. 새로운 도시에서의 특별한 경험을 만나보세요!',
        keywords: '랜덤 도시, 도시 여행, 랜덤 여행지, 도시 추천, 국내 도시 여행',
        structuredData: createRandomTravelServiceSchema('city')
      };
    
    case 'random-theme':
      return {
        ...baseMetadata,
        title: `${data.province || '전국'} ${data.city || '랜덤 여행지'} - 테마별 랜덤 여행`,
        description: `${data.province || '전국'} ${data.city || '랜덤 여행지'}에서 다양한 테마로 분류된 랜덤 여행을 즐겨보세요. 자연, 문화, 맛집, 액티비티 등 나만의 취향에 맞는 여행을 발견하세요!`,
        keywords: `${data.province || ''} ${data.city || ''} 테마 여행, 랜덤 테마, 여행 테마, 취향별 여행, 맞춤 여행, 자연 여행, 문화 여행, 맛집 투어`,
        structuredData: createRandomTravelServiceSchema('theme')
      };
    
    case 'course':
      return {
        ...baseMetadata,
        title: '여행 코스',
        description: '추천받은 여행지로 완성된 나만의 여행 코스를 확인해보세요. 최적화된 여행 루트를 제공합니다.',
        keywords: '여행 코스, 여행 루트, 여행 일정, 코스 추천, 여행 계획',
        type: 'article',
        structuredData: data.itinerary ? createTravelItinerarySchema(data.itinerary) : baseMetadata.structuredData
      };
    
    case 'result':
      return {
        ...baseMetadata,
        title: `${data.destination?.name || '여행지'} 추천 결과`,
        description: `${data.destination?.name || '추천된 여행지'}에서 특별한 여행을 시작해보세요. 도파민 여행이 선별한 최고의 여행 경험을 만나보세요.`,
        keywords: `${data.destination?.name || ''}, 여행지, 여행 추천, 랜덤 여행, 도파민 여행`,
        type: 'article',
        structuredData: data.destination ? createTravelDestinationSchema(data.destination) : baseMetadata.structuredData
      };
    
    default:
      return baseMetadata;
  }
};
