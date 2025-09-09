import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 고급 SEO 기능을 제공하는 컴포넌트
 * - 동적 메타 태그 생성
 * - 페이지별 맞춤 구조화된 데이터
 * - 소셜 미디어 최적화
 */
function AdvancedSEO({ 
  pageData, 
  breadcrumbs = [], 
  faq = [], 
  reviews = [],
  localBusiness,
  event 
}) {
  
  // 브레드크럼 구조화된 데이터
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  // FAQ 구조화된 데이터
  const faqSchema = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // 리뷰 집계 구조화된 데이터
  const reviewSchema = reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "Service",
      "name": "랜덤 여행 - 도파민 여행"
    },
    "ratingValue": reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    "reviewCount": reviews.length,
    "bestRating": 5,
    "worstRating": 1
  } : null;

  // 지역 비즈니스 구조화된 데이터
  const localBusinessSchema = localBusiness ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": localBusiness.name,
    "description": localBusiness.description,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR",
      "addressRegion": localBusiness.region,
      "addressLocality": localBusiness.city
    },
    "geo": localBusiness.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": localBusiness.coordinates.lat,
      "longitude": localBusiness.coordinates.lng
    } : undefined,
    "openingHours": localBusiness.openingHours || [],
    "telephone": localBusiness.phone,
    "url": localBusiness.website
  } : null;

  // 이벤트 구조화된 데이터
  const eventSchema = event ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "location": {
      "@type": "Place",
      "name": event.location.name,
      "address": event.location.address
    },
    "organizer": {
      "@type": "Organization",
      "name": "도파민 여행"
    }
  } : null;

  // 모든 스키마를 배열로 수집
  const schemas = [
    breadcrumbSchema,
    faqSchema,
    reviewSchema,
    localBusinessSchema,
    eventSchema
  ].filter(Boolean);

  return (
    <Helmet>
      {/* 고급 메타 태그들 */}
      {pageData?.lastModified && (
        <meta name="last-modified" content={pageData.lastModified} />
      )}
      
      {pageData?.category && (
        <meta name="category" content={pageData.category} />
      )}
      
      {pageData?.tags && pageData.tags.length > 0 && (
        <meta name="news_keywords" content={pageData.tags.join(', ')} />
      )}
      
      {/* 소셜 미디어 추가 메타 태그 */}
      <meta property="og:updated_time" content={pageData?.lastModified || new Date().toISOString()} />
      
      {/* 모바일 앱 링크 */}
      <meta property="al:web:url" content={window.location.href} />
      
      {/* 구조화된 데이터들 */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* DNS prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Preconnect for critical resources */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
}

export default AdvancedSEO;
