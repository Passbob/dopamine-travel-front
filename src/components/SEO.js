import React from 'react';
import { Helmet } from 'react-helmet-async';

function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author = '도파민 여행',
  publishedTime,
  modifiedTime,
  section,
  tags,
  structuredData,
  noIndex = false,
  canonical
}) {
  const defaultTitle = '랜덤 여행 추천 - 도파민 여행';
  const defaultDescription = 'AI 추천 기반 랜덤 여행지 생성 서비스. 어디로 갈지 고민될 때, 도파민과 함께 새로운 여행지를 발견하세요.';
  const defaultKeywords = '여행, 랜덤 여행, 여행지 추천, 도파민 여행, 국내여행, AI 추천';
  const defaultImage = `${window.location.origin}/web-app-manifest-512x512.png`;
  const defaultUrl = window.location.href;

  const siteTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const siteDescription = description || defaultDescription;
  const siteKeywords = keywords || defaultKeywords;
  const siteImage = image || defaultImage;
  const siteUrl = canonical || url || defaultUrl;

  // 구조화된 데이터 기본값
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": defaultTitle,
    "description": siteDescription,
    "url": siteUrl,
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Any",
    "author": {
      "@type": "Organization",
      "name": author
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content={author} />
      
      {/* 검색 엔진 제어 */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {!noIndex && <meta name="robots" content="index,follow" />}
      
      {/* 언어 및 지역 설정 */}
      <meta name="language" content="ko" />
      <meta name="geo.region" content="KR" />
      <meta name="geo.country" content="KR" />
      
      {/* Open Graph 태그 */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:locale" content="ko_KR" />
      
      {/* 추가 Open Graph 속성 */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter 카드 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      <meta name="twitter:site" content="@dopamine_travel" />
      <meta name="twitter:creator" content="@dopamine_travel" />
      
      {/* 네이버, 다음 등 한국 검색엔진 최적화 */}
      <meta name="naver-site-verification" content="naver802378eba5331d9c45d830ba142a5831" />
      
      {/* 모바일 최적화 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* 캐노니컬 URL */}
      <link rel="canonical" href={siteUrl} />
      
      {/* 구조화된 데이터 */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
}

export default SEO; 