"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, saveUserForRelogin, getSession, clearAllSessions } from "@/lib/auth";
import LogoutModal from "./LogoutModal";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/instructor/dashboard", label: "Dashboard" },
    { href: "/instructor/view-enquiries", label: "View Enquiries" },
    { href: "/instructor/upload-materials", label: "Upload Materials" },
    { href: "/instructor/announcements", label: "Announcements" },
    { href: "/instructor/profile", label: "Profile" },
    { href: "/auth/login", label: "Logout", isLogout: true },
  ];

  const handleLogoutClick = (isLogout?: boolean) => {
    if (isLogout) {
      setLogoutConfirmOpen(true);
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if user is on an instructor page
      if (pathname.startsWith("/instructor")) {
        event.preventDefault();
        setLogoutConfirmOpen(true);
        // Push state again to prevent navigation
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Push initial state
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    // Clear session and save user info for relogin prompt
    const session = getSession("instructor");
    if (session) {
      saveUserForRelogin("instructor", session.email, session.name);
    }
    // Clear all sessions to prevent conflicts
    clearAllSessions();
    router.push("/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-teal-900 text-white h-screen fixed shadow-md">
        <h2 className="text-center mt-6 mb-8 text-xl font-bold tracking-wide">Instructor Panel</h2>
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href}>
              {link.isLogout ? (
                <button
                  onClick={() => handleLogoutClick(link.isLogout)}
                  className="w-full text-left block py-3 px-6 font-semibold hover:bg-teal-700 transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="block py-3 px-6 font-semibold hover:bg-teal-700 transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center bg-teal-900 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
        <h2 className="text-lg font-bold tracking-wide">Instructor Panel</h2>
        <button
          className="flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Sidebar with smooth animation */}
      <aside
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        ></div>

        {/* Sliding Sidebar */}
        <div
          className={`bg-teal-900 w-64 h-full p-6 shadow-lg transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
                {link.isLogout ? (
                  <button
                    onClick={() => { handleLogoutClick(link.isLogout); setMobileOpen(false); }}
                    className="w-full text-left block py-3 px-4 font-semibold text-white hover:bg-teal-700 rounded transition"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 px-4 font-semibold text-white hover:bg-teal-700 rounded transition"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={logoutConfirmOpen}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
        role="instructor"
      />
    </>
  );
}
