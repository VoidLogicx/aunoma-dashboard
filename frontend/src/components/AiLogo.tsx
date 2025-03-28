import React from "react";
import { Link } from "react-router-dom";
import { AunomaDots } from "./AunomaDots";

export interface AiLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
  variant?: "default" | "light";
  showText?: boolean;
}

export function AiLogo({ size = "medium", className = "", variant = "default", showText = true }: AiLogoProps) {
  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "text-lg";
      case "large":
        return "text-3xl";
      case "medium":
      default:
        return "text-2xl";
    }
  };

  const getTextClass = () => {
    return variant === "light" ? "text-white" : "text-black";
  };

  const getDotSize = () => {
    switch (size) {
      case "small":
        return "w-6 h-6";
      case "large":
        return "w-12 h-12";
      case "medium":
      default:
        return "w-8 h-8";
    }
  };

  return (
    <Link 
      to="/dashboard" 
      className={`flex items-center font-bold ${getSizeClass()} ${className}`}
      aria-label="Aunoma.ai Dashboard"
    >
      <AunomaDots className={getDotSize()} />
      {showText && (
        <div className="ml-2 font-bold tracking-tight flex items-center">
          <span className={getTextClass()}>Aunoma</span>
          <span className="relative flex items-center">
            <span className={getTextClass()}>.a</span>
            <span 
              className="inline-block bg-[#D10A11] rounded-full mx-0.5 mb-0.5"
              style={{
                width: size === "small" ? "4px" : size === "large" ? "8px" : "6px",
                height: size === "small" ? "4px" : size === "large" ? "8px" : "6px"
              }}
              aria-hidden="true"
            ></span>
            <span className={getTextClass()}>i</span>
          </span>
        </div>
      )}
    </Link>
  );
}
