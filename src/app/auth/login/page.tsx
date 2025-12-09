"use client";

import React, { useState, useEffect, Suspense } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import VisitorHeader from "../../../../components/VisitorHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { setSession, clearReloginUser } from "@/lib/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA2wwTdPSgNjcyoxjPDU_00ceGaU882XC8",
  authDomain: "nextgen-9de89.firebaseapp.com",
  projectId: "nextgen-9de89",
  storageBucket: "nextgen-9de89.firebasestorage.app",
  messagingSenderId: "446092918649",
  appId: "1:446092918649:web:4c83d7349c62e33cb279a8"

};

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<{
    title: string;
    message: string;
    redirect?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for redirect and role from URL params
  useEffect(() => {
    const urlRole = searchParams.get("role");
    const redirect = searchParams.get("redirect");
    
    if (urlRole && ["admin", "student", "instructor"].includes(urlRole)) {
      setRole(urlRole);
    }
  }, [searchParams]);

  // Prevent user from going back to login page
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      router.replace("/"); // Redirect to home page
    };
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [router]);

  const showPopup = (title: string, message: string, redirect?: string) => {
    setPopup({ title, message, redirect });
  };

  const handleRoleSelect = (selectedRole: string) => {
    if (role && role !== selectedRole) {
      setEmail("");
      setPassword("");
    }
    setRole(selectedRole);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      showPopup("Error", "Please select your account type first!");
      return;
    }

    if (!email || !password) {
      showPopup("Error", "Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      // Admin hardcoded login
      if (role === "admin") {
        if (email === "admin@gmail.com" && password === "admin") {
          // Set session token
          setSession("admin", email, "Admin");
          clearReloginUser(); // Clear relogin prompt
          
          const redirect = searchParams.get("redirect") || "/admin/dashboard";
          showPopup("Welcome Admin", "Login successful!", redirect);
        } else {
          showPopup("Error", "Invalid admin credentials!");
        }
        setLoading(false);
        return;
      }

      // Student / Instructor login
      const collectionName = role === "student" ? "students" : "instructors";
      const q = query(
        collection(db, collectionName),
        where("email", "==", email),
        where("password", "==", password)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        showPopup("Error", "Invalid credentials!");
      } else {
        const userData = snapshot.docs[0].data();
        const name = (userData.fullname || userData.name || "User") as string;

        if (role === "student") {
          // Set session token
          setSession("student", email, name, snapshot.docs[0].id);
          clearReloginUser(); // Clear relogin prompt
          
          const redirect = searchParams.get("redirect") || "/student/courses";
          showPopup(
            `Welcome ${name}`,
            "Login successful!",
            redirect
          );
        } else {
          // Set session token for instructor
          setSession("instructor", email, name, snapshot.docs[0].id);
          clearReloginUser(); // Clear relogin prompt
          
          const redirect = searchParams.get("redirect") || "/instructor/dashboard";
          showPopup(
            `Welcome ${name}`,
            "Login successful!",
            redirect
          );
        }
      }
    } catch (error) {
      console.error(error);
      showPopup("Error", "Something went wrong. Please try again!");
    }

    setLoading(false);
  };

  const handlePopupClose = () => {
    if (popup?.redirect) window.location.href = popup.redirect;
    setPopup(null);
  };

  return (
    <div className="font-[Poppins] bg-[#e0f2f1] text-[#333] min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full flex-shrink-0">
        <VisitorHeader />
      </div>

      {/* Main content */}
      <div className="flex-1 flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 sm:m-6">
          <h2 className="text-4xl font-bold mb-2 text-center">Welcome Back</h2>
          <p className="text-center mb-6 text-teal-100 text-xl">Choose Account Type</p>

          {/* Role Selection */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6 overflow-x-auto md:overflow-x-visible">
            {[ 
              {
                id: "student",
                label: "Student",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 sm:w-10 sm:h-10 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m0 0l9-5m-9 5l-9-5"
                    />
                  </svg>
                ),
              },
              {
                id: "instructor",
                label: "Instructor",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 sm:w-10 sm:h-10 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6l4 2m4 4H4m16 0v-4a4 4 0 00-4-4H8a4 4 0 00-4 4v4"
                    />
                  </svg>
                ),
              },
              {
                id: "admin",
                label: "Admin",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 sm:w-10 sm:h-10 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2a5 5 0 015 5v5h-1V7a4 4 0 10-8 0v5H7V7a5 5 0 015-5zM4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"
                    />
                  </svg>
                ),
              },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r.id)}
                className={`flex flex-col items-center min-w-[75px] sm:min-w-[90px] p-3 rounded-xl border-2 transition-all duration-300 transform ${
                  role === r.id
                    ? "border-white bg-white/20 shadow-lg shadow-white/20 scale-105"
                    : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10 hover:scale-105"
                }`}
              >
                {r.icon}
                <span className="font-semibold text-sm sm:text-base">{r.label}</span>
              </button>
            ))}
          </div>

          {/* Role Welcome Message */}
          {role && (
            <div className="text-center mb-4 animate-fadeIn text-teal-100">
              <p className="font-semibold text-lg">
                Welcome {role.charAt(0).toUpperCase() + role.slice(1)}!
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-semibold mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern text-black"
                placeholder="Enter your email"
                disabled={!role}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern text-black"
                placeholder="Enter your password"
                disabled={!role}
              />
              {/* 🔹 Forgot Password Link */}
              {role === "student" && (
                <div className="text-right mt-2">
                  <a
                    href="/auth/forgotpassword"
                    className="text-sm text-teal-100 hover:text-white underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!role || loading}
              className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ${
                !role || loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "btn-modern-primary bg-white text-teal-900 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <p className="text-lg text-center mt-4 text-teal-100">
            Don’t have an account?{" "}
            <a href="/auth/register" className="underline font-semibold">
              Register Now
            </a>
          </p>
        </div>

        {/* Popup Modal */}
        {popup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white p-6 rounded-xl shadow-lg text-center w-80">
              <h3 className="text-xl font-bold mb-2">{popup.title}</h3>
              <p className="mb-4">{popup.message}</p>
              <button
                onClick={handlePopupClose}
                className="btn-modern-primary px-6 py-2 bg-white text-teal-900 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100"
              >
                OK
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-in-out;
          }
        `}</style>
      </div>

      <footer className="bg-teal-900 text-teal-100 text-center py-4 mt-auto">
        &copy; 2025 NextGen Institute. All Rights Reserved.
      </footer>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
