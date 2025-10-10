"use client";

import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import VisitorHeader from "../../../../components/VisitorHeader";
import { useRouter } from "next/navigation";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCnUUk7n_oZQqnjKa11ed_SV5P8AGs1_mU",
  authDomain: "skillpro-64e09.firebaseapp.com",
  projectId: "skillpro-64e09",
  storageBucket: "skillpro-64e09.firebasestorage.app",
  messagingSenderId: "972129736269",
  appId: "1:972129736269:web:787e4bf820828e20716e04",
};

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState<{
    title: string;
    message: string;
    redirect?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

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
          showPopup("Welcome Admin", "Login successful!", "/admin/dashboard");
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
          localStorage.setItem("loggedStudentEmail", email);
          localStorage.setItem("loggedStudentName", name);
          showPopup(
            `Welcome ${name}`,
            "Login successful!",
            "/student/courses"
          );
        } else {
          localStorage.setItem("instructorDocId", snapshot.docs[0].id);
          showPopup(
            `Welcome ${name}`,
            "Login successful!",
            "/instructor/dashboard"
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
                className={`flex flex-col items-center min-w-[75px] sm:min-w-[90px] p-3 rounded-xl border-2 transition transform hover:scale-105 ${
                  role === r.id
                    ? "border-white bg-white/10"
                    : "border-transparent hover:border-teal-200"
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
                className="w-full p-3 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                className="w-full p-3 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-teal-400"
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
              className={`w-full font-bold py-3 rounded-lg transition ${
                !role || loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-white text-teal-900 hover:bg-teal-200"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
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
                className="bg-white text-teal-900 px-6 py-2 rounded-lg font-semibold hover:bg-teal-200 transition"
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
