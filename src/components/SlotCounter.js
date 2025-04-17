import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 슬롯머신 스타일의 숫자 카운터 컴포넌트
 * @param {Object} props 컴포넌트 속성
 * @param {number} props.value 최종 표시할 숫자
 * @param {number} props.duration 애니메이션 지속 시간(ms)
 * @param {number} props.delay 시작 전 지연 시간(ms)
 * @param {string} props.className 추가 CSS 클래스
 */
const SlotCounter = ({ value = 0, duration = 2000, delay = 0, className = '' }) => {
  // 현재 표시하는 숫자
  const [currentValue, setCurrentValue] = useState(0);
  // 애니메이션 완료 여부
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  // 최종 숫자의 자릿수
  const digitCount = value.toString().length;
  
  useEffect(() => {
    // 숫자가 0이면 애니메이션 생략
    if (value === 0) {
      setCurrentValue(0);
      setIsAnimationComplete(true);
      return;
    }
    
    // 애니메이션 시작 전 지연
    const startDelay = setTimeout(() => {
      // 애니메이션의 진행 상황을 계산하는 함수
      const animateNumber = () => {
        const startTime = Date.now();
        const endTime = startTime + duration;
        
        const updateNumber = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          
          // 처음에는 빠르게 변하다가 점점 느려지는 이징 함수
          const easeOutExpo = 1 - Math.pow(1 - progress, 4);
          
          // 최대 표시 숫자를 최종값의 5배까지 표시
          const maxDisplayNumber = Math.max(value * 5, 999);
          
          // 진행률에 따라 현재 표시할 숫자 계산
          if (progress < 0.8) { // 80%까지는 랜덤한 숫자 표시
            setCurrentValue(Math.floor(Math.random() * maxDisplayNumber));
          } else { // 마지막 20%에서 최종값으로 수렴
            const finalEasing = (progress - 0.8) / 0.2; // 0~1 사이 값으로 변환
            const easedFinalValue = Math.floor(value * finalEasing);
            setCurrentValue(value - Math.max(easedFinalValue, 0));
          }
          
          // 애니메이션 종료 시
          if (progress >= 1) {
            setCurrentValue(value);
            setIsAnimationComplete(true);
            return;
          }
          
          // 다음 프레임 요청
          requestAnimationFrame(updateNumber);
        };
        
        // 첫 프레임 시작
        requestAnimationFrame(updateNumber);
      };
      
      // 애니메이션 시작
      animateNumber();
    }, delay);
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(startDelay);
  }, [value, duration, delay]);
  
  // 숫자를 배열로 변환 (각 자릿수를 개별적으로 애니메이션하기 위함)
  const getDigits = (num) => {
    const digits = num.toString().padStart(digitCount, '0').split('');
    return digits;
  };
  
  const digits = getDigits(currentValue);
  
  return (
    <span className={`slot-counter ${className}`}>
      <AnimatePresence>
        {digits.map((digit, index) => (
          <motion.span
            key={`digit-${index}`}
            className="digit"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.1 }}
          >
            {digit}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
};

export default SlotCounter; 