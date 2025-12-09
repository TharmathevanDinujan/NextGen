"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function VisitorHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll position for blur effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <header 
        className={`text-white fixed top-0 left-0 right-0 z-50 font-[Poppins] transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#004d40]/70 backdrop-blur-lg shadow-xl' 
            : 'bg-[#004d40]/90 backdrop-blur-md'
        }`}
        style={{
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(8px)',
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'blur(8px)',
        }}
      >
        <nav className="flex items-center justify-between px-4 py-3 md:px-6 relative">
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
          <li className="relative z-10" style={{ overflow: 'hidden', borderRadius: '0.75rem' }}>
            <Link
              href="/auth/register"
              className="btn-modern-primary px-4 py-2 text-base inline-block"
            >
              <span className="relative z-10">Register</span>
            </Link>
          </li>
          <li className="relative z-10">
            <Link
              href="/auth/login"
              className="btn-modern-secondary px-4 py-2 text-base inline-block"
            >
              Login
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-300 flex items-center justify-center min-w-[44px] min-h-[44px] relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ 
            zIndex: 9999,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            isolation: 'isolate',
            position: 'relative'
          }}
        >
          <div className="w-6 h-5 flex flex-col justify-between relative" style={{ zIndex: 10000 }}>
            <span
              className={`block h-[3px] w-full bg-white rounded-full transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
              style={{ boxShadow: '0 0 2px rgba(0,0,0,0.3)' }}
            />
            <span
              className={`block h-[3px] w-full bg-white rounded-full transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
              style={{ boxShadow: '0 0 2px rgba(0,0,0,0.3)' }}
            />
            <span
              className={`block h-[3px] w-full bg-white rounded-full transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
              style={{ boxShadow: '0 0 2px rgba(0,0,0,0.3)' }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu - Side Drawer */}
      <>
        {/* Backdrop Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden"
            onClick={() => setMenuOpen(false)}
            style={{ zIndex: 55 }}
          />
        )}

        {/* Side Drawer */}
        <div
          className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-gradient-to-br from-[#004d40] to-[#00695c] shadow-2xl z-[60] md:hidden flex flex-col transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ zIndex: 60 }}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20" style={{ flexShrink: 0 }}>
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

          {/* Drawer Content - Scrollable Navigation Links */}
          <div style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0, padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '1.125rem',
                    backgroundColor: pathname === link.href ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateX(0.5rem)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Register and Login Buttons - Right after Contact Us */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
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
        </div>
      </>
      </header>
    </>
  );
}
