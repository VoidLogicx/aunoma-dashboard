/**
 * TransitionEffect component for adding subtle transitions and animations
 */
import { useEffect, useState } from "react";

interface TransitionEffectProps {
  children: React.ReactNode;
  type?: "fade" | "slide-up" | "slide-down" | "scale";
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
}

export function TransitionEffect({
  children,
  type = "fade",
  delay = 0,
  duration = 300,
  triggerOnce = true
}: TransitionEffectProps) {
  const [isVisible, setIsVisible] = useState(!triggerOnce);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, triggerOnce]);
  
  // Prepare CSS classes based on animation type
  const getTransitionClasses = () => {
    const baseClasses = `transition-all duration-${duration}`;
    
    if (!isVisible) {
      switch (type) {
        case "fade":
          return `${baseClasses} opacity-0`;
        case "slide-up":
          return `${baseClasses} opacity-0 translate-y-4`;
        case "slide-down":
          return `${baseClasses} opacity-0 -translate-y-4`;
        case "scale":
          return `${baseClasses} opacity-0 scale-95`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    return baseClasses;
  };
  
  return <div className={getTransitionClasses()}>{children}</div>;
}

/**
 * SkeletonLoader component for creating loading placeholders
 */
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
  animate = true
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "circular":
        return "rounded-full";
      case "rectangular":
        return "rounded-md";
      case "text":
      default:
        return "rounded w-full h-4";
    }
  };
  
  const styleProps: React.CSSProperties = {};
  if (width) styleProps.width = typeof width === "number" ? `${width}px` : width;
  if (height) styleProps.height = typeof height === "number" ? `${height}px` : height;
  
  return (
    <div
      className={`bg-gray-200 ${getVariantClasses()} ${animate ? "animate-pulse" : ""} ${className}`}
      style={styleProps}
      aria-hidden="true"
      role="presentation"
    />
  );
}
