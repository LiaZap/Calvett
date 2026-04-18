"use client";

import Link from "next/link";

interface TopBarProps {
  title: string;
  breadcrumb: string;
}

export default function TopBar({ title, breadcrumb }: TopBarProps) {
  // If the breadcrumb starts with "Início" we make that prefix a clickable link
  // back to the dashboard. Otherwise render the string as-is.
  const renderBreadcrumb = () => {
    const trimmed = breadcrumb.trimStart();
    if (trimmed.toLowerCase().startsWith("início")) {
      const rest = trimmed.slice("Início".length);
      return (
        <>
          <Link href="/" className="hover:text-[#1e1e1e] transition-colors">
            Início
          </Link>
          {rest}
        </>
      );
    }
    return breadcrumb;
  };

  return (
    <div className="flex items-center justify-between px-[58px] pt-[27px] pb-4 font-[var(--font-zalando-stack)]">
      <div>
        <p className="text-[12px] font-medium text-[#1e1e1e]">{title}</p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">{renderBreadcrumb()}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-[12px] font-medium text-[rgba(15,15,15,0.63)]">Seg, 12 jan</p>
        <div className="border border-[#f4f4f4] rounded-[37px] h-[50px] flex items-center px-4 gap-3">
          <div className="bg-[#f2f2f2] rounded-full w-[37px] h-[37px] flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5">
              <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
          <div className="bg-[#ff9898] rounded-[13px] px-[5px] py-[5px]">
            <span className="text-[10px] font-semibold text-white">05</span>
          </div>
        </div>
        <div className="border border-[#e9e9e9] rounded-[17px] w-[50px] h-[50px] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
