import React from "react";
import { cn } from "../utils/cn";

export interface AiModuleProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function AiModuleCard({ title, description, icon, isActive = false, className }: AiModuleProps) {
  return (
    <div
      className={cn(
        "flex flex-col p-6 rounded-lg transition-all hover:transform hover:scale-[1.02] h-full",
        isActive 
          ? "border-l-4 border-aunoma-red shadow-md bg-white relative overflow-hidden hover:shadow-lg transition-shadow duration-300" 
          : "border border-gray-200 bg-aunoma-bg hover:border-aunoma-inactive opacity-80 hover:bg-gray-50 transition-all duration-300",
        className
      )}
    >

      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-aunoma-blue">{icon}</div>}
        <h3 className={cn(
          "text-lg font-semibold", 
          isActive ? "text-aunoma-red" : "text-gray-600"
        )}> 
          {title}
        </h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      {isActive ? (
        <div className="mt-4 text-xs text-aunoma-blue font-medium flex items-center">
          <span className="w-2 h-2 bg-aunoma-blue rounded-full mr-2 animate-pulse"></span>
          Aktywny moduł
        </div>
      ) : (
        <div className="mt-4 text-xs text-gray-500 font-medium flex items-center">
          <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
          Moduł nieaktywny
        </div>
      )}
    </div>
  );
}