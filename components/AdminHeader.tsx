"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, saveUserForRelogin, getSession, clearAllSessions } from "@/lib/auth";
import LogoutModal from "./LogoutModal";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Ensure hydration-safe active link highlighting
  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/manage-courses", label: "Manage Courses" },
    { href: "/admin/manage-instructers", label: "Manage Instructors" },
    { href: "/admin/manage-students", label: "Manage Students" },
    { href: "/admin/view-inquiries", label: "View Inquiries" },
    { href: "/admin/announcements", label: "Announcements" },
    { href: "/auth/login", label: "Logout" },
  ];

  const handleLogoutClick = (href: string) => {
    setLogoutConfirm(true);
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if user is on an admin page
      if (pathname.startsWith("/admin")) {
        event.preventDefault();
        setLogoutConfirm(true);
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
    setLogoutConfirm(false);
    // Clear session and save user info for relogin prompt
    const session = getSession("admin");
    if (session) {
      saveUserForRelogin("admin", session.email, session.name);
    }
    // Clear all sessions to prevent conflicts
    clearAllSessions();
    router.push("/"); // navigate to home page
  };

  const cancelLogout = () => {
    setLogoutConfirm(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-[#004d40] text-white p-4 fixed top-0 left-0 w-full z-50">
        <div className="flex items-center gap-2">
          <img src="../images/logo.png" alt="Logo" className="w-10 h-8" />
          <h2 className="font-bold text-lg">Admin Panel</h2>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white focus:outline-none text-2xl"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          bg-[#004d40] text-white fixed top-0 left-0 h-full w-64 p-6 pt-20 z-50
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-center mb-6 gap-2">
          <img src="../images/logo.png" alt="Logo" className="w-13 h-10" />
          <h2 className="text-2xl font-bold text-[#e0f2f1]">Admin Panel</h2>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-2 overflow-auto">
          {links.map((link) => (
            <li key={link.href}>
              {link.href === "/auth/login" ? (
                // Logout button
                <button
                  onClick={() => handleLogoutClick(link.href)}
                  className={`
                    w-full text-left block px-4 py-2 rounded-md font-semibold transition-colors
                    ${mounted && pathname === link.href
                      ? "border-b-2 border-green-500 md:border-l-4 md:border-b-0"
                      : "hover:bg-[#009688]"
                    }
                  `}
                >
                  {link.label}
                </button>
              ) : (
                // Normal links
                <Link
                  href={link.href}
                  className={`
                    block px-4 py-2 rounded-md font-semibold transition-colors
                    ${mounted && pathname === link.href
                      ? "border-b-2 border-green-500 md:border-l-4 md:border-b-0"
                      : "hover:bg-[#009688]"
                    }
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile background overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={logoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        role="admin"
      />
    </>
  );
}
