import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface PageBreadcrumbProps {
  current: string;
  subtitle?: string;
}

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ current, subtitle }) => {
  return (
    <div className="bg-slate-100 border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-semibold text-slate-600">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[#0c2340] hover:text-[#ff6600] font-bold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold">{current}</span>
        </nav>
        {subtitle && (
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
