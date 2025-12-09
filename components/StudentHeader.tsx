"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, saveUserForRelogin, getSession } from "@/lib/auth";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear session and save user info for relogin prompt
    const session = getSession("student");
    if (session) {
      saveUserForRelogin("student", session.email, session.name);
      clearSession("student");
    }
    router.push("/");
  };

  const links = [
    { href: "/student/courses", label: "Courses" },
    { href: "/student/assignments", label: "Assignments" },
    { href: "/student/schedule", label: "Schedule" },
    { href: "/student/enquiry", label: "Enquiry" },
    { href: "/student/announcements", label: "Announcements" },
    { href: "/student/profile", label: "Profile" },
    { href: "/auth/login", label: "Logout" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-teal-900 text-white shadow-md flex justify-between items-center p-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12" />
          <span className="font-semibold text-lg">SkillPro Institute</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 font-medium">
          {links.map((link) => (
            link.href === "/auth/login" ? (
              <button
                key={link.href}
                onClick={() => setLogoutConfirm(true)}
                className="transition-colors relative hover:text-yellow-400"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors relative hover:text-yellow-400 ${
                  pathname === link.href ? "text-yellow-400" : ""
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 rounded"></span>
                )}
              </Link>
            )
          ))}
        </nav>

        {/* Hamburger / Close Button */}
        <button
          className="md:hidden focus:outline-none z-50"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-teal-900 text-white transform transition-transform duration-300 z-50 shadow-lg
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-teal-700">
          <span className="font-semibold text-lg">Menu</span>
        </div>
        <nav className="flex flex-col p-4 gap-3">
          {links.map((link) => (
            link.href === "/auth/login" ? (
              <button
                key={link.href}
                onClick={() => { setLogoutConfirm(true); setMobileOpen(false); }}
                className="py-2 px-2 rounded transition-colors hover:bg-teal-700 text-left"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-2 rounded transition-colors hover:bg-teal-700 relative ${
                  pathname === link.href ? "bg-teal-800" : ""
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-400 rounded"></span>
                )}
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Blur Background */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setLogoutConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-xl w-full max-w-sm p-6 m-4 z-10">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              ⚠️ Confirm Logout
            </h3>
            <p className="text-center mb-6 text-gray-600">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg font-semibold text-white hover:bg-red-600 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setLogoutConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
