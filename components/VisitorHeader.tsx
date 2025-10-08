"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function VisitorHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/visitor/course", label: "Courses" },
    { href: "/visitor/notices", label: "Notices & Events" },
    { href: "/visitor/contact", label: "Contact Us" },
    
  ];

  return (
    <header className="bg-[#004d40] text-white sticky top-0 z-50 font-[Poppins]">
      <nav className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo + Company Name */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="SkillPro Logo"
            width={60}
            height={60}
            className="w-[55px] h-[45px] sm:w-[60px] sm:h-[50px] md:w-[74px] md:h-[60px]"
          />
          <span className="font-bold text-lg sm:text-xl md:text-2xl">
          NextGen Institute
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <li key={link.href} className="group relative">
              <Link
                href={link.href}
                className="relative px-3 py-2 font-medium text-white rounded-md transition-colors text-lg"
              >
                {link.label}
                {/* Active underline */}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </li>
          ))}

          {/* Register & Login Buttons */}
          <li>
            <Link
              href="/auth/register"
              className=" px-4 py-2 rounded-md font-semibold hover:bg-[#60aea1] transition-colors text-lg"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              href="/auth/login"
              className="border-2 border-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-[#004d40] transition-colors text-lg"
            >
              Login
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center bg-[#004d40] border-t border-white/20 py-4 space-y-2 animate-[slideDown_0.3s_ease_forwards]">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-2 w-full text-center text-white rounded-md hover:bg-[#00796b] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
              {/* Optional: underline for mobile active link */}
              {pathname === link.href && (
                <span className="block w-full h-[2px] bg-white mt-1"></span>
              )}
            </li>
          ))}

          <li>
            <Link
              href="/auth/register"
              className="block w-full text-center px-4 py-2 rounded-md font-semibold hover:bg-[#63ab9f] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              href="/auth/login"
              className="block w-full text-center border-2 border-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-[#004d40] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
