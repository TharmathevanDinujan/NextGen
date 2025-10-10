"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

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

  const confirmLogout = () => {
    // Clear local storage and redirect
    localStorage.removeItem("instructorDocId");
    window.location.href = "/auth/login";
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
      <div className="md:hidden flex justify-between items-center bg-teal-900 text-white p-4 shadow-md">
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

      {/* Logout Confirmation Popup */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setLogoutConfirmOpen(false)}
          ></div>
          <div className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-sm z-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogout}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
