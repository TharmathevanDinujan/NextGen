"use client";

import { useEffect } from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  role?: "admin" | "student" | "instructor";
}

export default function LogoutModal({
  isOpen,
  onConfirm,
  onCancel,
  role = "admin",
}: LogoutModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const roleColors = {
    admin: {
      gradient: "from-red-500 to-red-600",
      hover: "hover:from-red-600 hover:to-red-700",
      icon: "👤",
    },
    student: {
      gradient: "from-blue-500 to-blue-600",
      hover: "hover:from-blue-600 hover:to-blue-700",
      icon: "🎓",
    },
    instructor: {
      gradient: "from-purple-500 to-purple-600",
      hover: "hover:from-purple-600 hover:to-purple-700",
      icon: "👨‍🏫",
    },
  };

  const colors = roleColors[role];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all animate-slideInUp">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${colors.gradient} rounded-t-2xl p-6 text-center`}>
          <div className="text-5xl mb-2">{colors.icon}</div>
          <h3 className="text-2xl font-bold text-white">Confirm Logout</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6 text-lg">
            Are you sure you want to logout? You'll need to login again to access your account.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${colors.gradient} ${colors.hover} transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

