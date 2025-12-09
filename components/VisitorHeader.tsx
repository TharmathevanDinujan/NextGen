"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function VisitorHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

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
              className="btn-modern-primary px-4 py-2 text-base"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              href="/auth/login"
              className="btn-modern-secondary px-4 py-2 text-base"
            >
              Login
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-all duration-300 relative z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`block h-0.5 w-full bg-white rounded transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-white rounded transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-white rounded transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu - Side Drawer */}
      <>
        {/* Backdrop Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Side Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-[#004d40] to-[#00695c] shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="NextGen Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-bold text-lg text-white">NextGen</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto">
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:translate-x-2 hover:bg-white/10 ${
                    pathname === link.href ? "bg-white/15" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{link.label}</span>
                    {pathname === link.href && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full transition-all ${
                      pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="mx-4 my-4 border-t border-white/20"></div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 px-4 pb-4">
              <Link
                href="/auth/register"
                className="btn-modern-primary w-full text-center btn-modern-icon justify-center"
                onClick={() => setMenuOpen(false)}
              >
                <span>Register</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </Link>
              <Link
                href="/auth/login"
                className="btn-modern-secondary w-full text-center btn-modern-icon justify-center"
                onClick={() => setMenuOpen(false)}
              >
                <span>Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </>
    </header>
  );
}
