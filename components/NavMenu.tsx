"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NavMenu() {

  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);


  return (
    <div
      className="relative inline-block"
      ref={dropDownRef}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Menu
        <svg className="h-5 w-5 text-gray-400 transform transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute right-0 origin-top-right px-4 py-2 glass">
          <div className="flex flex-col gap-2 items-start z-50" role="menu" aria-orientation="vertical">
            <Link
              href="/"
              className=""
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#events"
              className=""
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/dashboard"
              className=""
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
