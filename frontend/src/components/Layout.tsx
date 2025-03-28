import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import { AiLogo } from "./AiLogo";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-aunoma-bg font-sans">
      {children}
      {showFooter && <AppFooter />}
    </div>
  );
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ to, children }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/dashboard" && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium py-1.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-aunoma-red/70 focus:ring-offset-1",
        isActive 
          ? "text-aunoma-red bg-aunoma-red/10 shadow-sm" 
          : "text-aunoma-gray-dark hover:text-aunoma-red hover:bg-aunoma-gray-light",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export function AppHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center">
        {children}
      </div>
    </header>
  );
}

export function AppLogo() {
  return (
    <AiLogo />
  );
}

export function AppNav() {
  return (
    <nav className="mt-4 md:mt-0" aria-label="Główna nawigacja">
      <ul className="flex flex-wrap space-x-2 md:space-x-8">
        <li>
          <NavLink to="/dashboard">Panel</NavLink>
        </li>
        <li>
          <NavLink to="/office-ai">Office AI</NavLink>
        </li>
        <li>
          <NavLink to="/sales-ai">Sales AI</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export function AppFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto" role="contentinfo">
      <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Aunoma.ai. Wszelkie prawa zastrzeżone.
        <p className="mt-2">
          <span className="inline-flex items-center text-aunoma-red">
            <span className="mr-1" aria-hidden="true">❤️</span> Zasilane przez sztuczną inteligencję
          </span>
        </p>
      </div>
    </footer>
  );
}

export function PageHeader({ 
  icon, 
  title, 
  description,
  children
}: { 
  icon?: React.ReactNode; 
  title: string; 
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md border-l-4 border-aunoma-red mb-8 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-3">
        {icon && <div className="text-aunoma-red mr-3" aria-hidden="true">{icon}</div>}
        <h1 className="text-2xl font-bold text-aunoma-gray-dark">{title}</h1>
      </div>
      {description && <p className="text-aunoma-gray max-w-3xl leading-relaxed">{description}</p>}
      {children}
    </div>
  );
}

export function ContentSection({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-white rounded-lg p-6 sm:p-8 shadow-md mb-6 border border-gray-50 hover:shadow-lg transition-shadow duration-300", className)}>
      {children}
    </section>
  );
}
