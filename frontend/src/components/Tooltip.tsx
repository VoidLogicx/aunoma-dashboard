import React, { useState, useRef, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

export function Tooltip({ 
  children, 
  content, 
  position = 'top', 
  delay = 300 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  
  // Calculate position based on the prop
  const getPositionClasses = () => {
    switch (position) {
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-1';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-1';
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    clearTimeout(hideTimerRef.current as unknown as number);
    hideTimerRef.current = null;
    
    if (!isVisible && !showTimerRef.current) {
      showTimerRef.current = window.setTimeout(() => {
        setIsVisible(true);
        showTimerRef.current = null;
      }, delay) as unknown as number;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    clearTimeout(showTimerRef.current as unknown as number);
    showTimerRef.current = null;
    
    if (isVisible && !isFocused && !hideTimerRef.current) {
      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        hideTimerRef.current = null;
      }, 200) as unknown as number;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!isVisible) {
      clearTimeout(hideTimerRef.current as unknown as number);
      setIsVisible(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isVisible && !isHovered) {
      setIsVisible(false);
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      
      {isVisible && (
        <div 
          className={`absolute z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-md whitespace-nowrap max-w-xs transition-opacity ${getPositionClasses()}`}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          <div className="text-center">{content}</div>
          {/* Add arrow based on position */}
          <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
            position === 'top' ? 'top-full -translate-y-1/2 left-1/2 -translate-x-1/2' :
            position === 'right' ? 'right-full translate-x-1/2 top-1/2 -translate-y-1/2' :
            position === 'bottom' ? 'bottom-full translate-y-1/2 left-1/2 -translate-x-1/2' :
            'left-full -translate-x-1/2 top-1/2 -translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  );
}