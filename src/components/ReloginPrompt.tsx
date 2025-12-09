"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReloginUser, clearReloginUser } from "@/lib/auth";

export default function ReloginPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [userInfo, setUserInfo] = useState<{ role: string; email: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const reloginUser = getReloginUser();
    if (reloginUser) {
      setUserInfo(reloginUser);
      setShowPrompt(true);
    }
  }, []);

  const handleLogin = () => {
    if (userInfo) {
      clearReloginUser();
      router.push(`/auth/login?role=${userInfo.role}`);
    }
  };

  const handleCancel = () => {
    clearReloginUser();
    setShowPrompt(false);
  };

  if (!showPrompt || !userInfo) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md m-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back, {userInfo.name}!
          </h3>
          <p className="text-gray-600">
            Do you want to login back as <span className="font-semibold text-teal-600">{userInfo.role}</span>?
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleLogin}
            className="btn-modern-primary w-full btn-modern-icon justify-center"
          >
            <span>Yes, Login</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="btn-modern-secondary w-full text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

