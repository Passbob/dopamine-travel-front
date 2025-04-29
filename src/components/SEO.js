import React from 'react';
import { Helmet } from 'react-helmet-async';

function SEO({ title, description, keywords, image, url }) {
  const defaultTitle = '도파민 여행';
  const defaultDescription = 'AI 추천 기반 랜덤 여행지 생성 서비스. 어디로 갈지 고민될 때, 도파민과 함께 새로운 여행지를 발견하세요.';
  const defaultKeywords = '여행, 랜덤 여행, 여행지 추천, 도파민 여행, 국내여행, AI 추천';
  const defaultImage = `${window.location.origin}/web-app-manifest-512x512.png`;
  const defaultUrl = window.location.href;

  const siteTitle = title ? `${defaultTitle} | ${title}` : defaultTitle;
  const siteDescription = description || defaultDescription;
  const siteKeywords = keywords || defaultKeywords;
  const siteImage = image || defaultImage;
  const siteUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      
      {/* Open Graph 태그 */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter 카드 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* 캐노니컬 URL */}
      <link rel="canonical" href={siteUrl} />
    </Helmet>
  );
}

export default SEO; 