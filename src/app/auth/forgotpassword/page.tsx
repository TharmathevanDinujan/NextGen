"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA2wwTdPSgNjcyoxjPDU_00ceGaU882XC8",
  authDomain: "nextgen-9de89.firebaseapp.com",
  projectId: "nextgen-9de89",
  storageBucket: "nextgen-9de89.firebasestorage.app",
  messagingSenderId: "446092918649",
  appId: "1:446092918649:web:4c83d7349c62e33cb279a8"

};

// Initialize Firebase (avoid duplicate initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null); // null = not checked yet
  const [passwordResetComplete, setPasswordResetComplete] = useState(false); // new state

  // Generate a 6-digit OTP
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Live email validation
  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        setEmailExists(null);
        return;
      }
      const q = query(collection(db, "students"), where("email", "==", email));
      const snapshot = await getDocs(q);
      setEmailExists(!snapshot.empty);
    };

    const timer = setTimeout(() => {
      checkEmail();
    }, 500); // debounce input by 500ms

    return () => clearTimeout(timer);
  }, [email]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    if (!email) {
      setStatus("Please enter your email.");
      return;
    }
    if (!emailExists) {
      setStatus("No account found with this email.");
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, "students"), where("email", "==", email));
      const snapshot = await getDocs(q);
      const otpCode = generateOtp();
      const now = Timestamp.now();

      await updateDoc(doc(db, "students", snapshot.docs[0].id), {
        otp: otpCode,
        otpTimestamp: now,
      });

      await emailjs.send(
        "service_kw1ef57",
        "template_idxx62d",
        {
          to_name: snapshot.docs[0].data().fullname || "Student",
          otp_code: otpCode,
          to_email: email,
        },
        "Ge4n4Q9JeKuSNSEUP"
      );

      setStatus("OTP sent! Enter it below.");
      setOtpSent(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      let message = "Error sending email. Please try again.";
      if (err && typeof err === "object") {
        // @ts-expect-error: err object may have text property
        if (err.text) message = `Error sending email: ${err.text}`;
        // @ts-expect-error: err object may have message property
        else if (err.message) message = `Error sending email: ${err.message}`;
      }
      setStatus(message);
    }

    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    if (!otp) {
      setStatus("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, "students"), where("email", "==", email));
      const snapshot = await getDocs(q);
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      if (userData.otp !== otp) {
        setStatus("Incorrect OTP. Please try again.");
        setLoading(false);
        return;
      }

      setStatus("OTP verified! Set your new password above.");
      setOtpVerified(true);
    } catch (error) {
      console.error(error);
      setStatus("Error verifying OTP. Try again.");
    }

    setLoading(false);
  };

  // Step 3: Set new password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    if (!newPassword) {
      setStatus("Please enter a new password.");
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, "students"), where("email", "==", email));
      const snapshot = await getDocs(q);
      const userDocId = snapshot.docs[0].id;

      await updateDoc(doc(db, "students", userDocId), {
        password: newPassword,
        otp: "",
        otpTimestamp: null,
      });

      setStatus("Password updated successfully! Redirecting to login...");
      setPasswordResetComplete(true); // mark reset as complete
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setNewPassword("");
      setEmail("");
      setEmailExists(null);

      // Redirect immediately
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      setStatus("Error updating password. Try again.");
    }

    setLoading(false);
  };

  // If password reset is complete, don't show the form again
  if (passwordResetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-2xl text-[#000] font-semibold mb-4">Password Reset Successful!</h2>
          <p className="text-[#000] mb-4">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-[#000] text-center mb-6">Forgot Password</h2>

        <form
          onSubmit={
            otpSent && !otpVerified
              ? handleVerifyOtp
              : !otpSent
              ? handleSendOtp
              : handleSetNewPassword
          }
          className="space-y-4"
        >
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#000] ">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-[#000] px-4 py-2 mt-1 border rounded-lg"
              required
              disabled={otpSent}
            />
            {/* Live Email Status */}
            {email && (
              <p
                className={`mt-1 text-sm ${
                  emailExists === null
                    ? "text-gray-500"
                    : emailExists
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {emailExists === null
                  ? "Checking email..."
                  : emailExists
                  ? "Email exists."
                  : "Email not found."}
              </p>
            )}
          </div>

          {/* OTP Input */}
          {otpSent && !otpVerified && (
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 text-[#000] py-2 mt-1 border rounded-lg"
                required
              />
            </div>
          )}

          {/* New Password Input */}
          {otpVerified && (
            <div>
              <label className="block text-sm font-medium text-[#000]">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-[#000] border rounded-lg"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l-3 3 3 3V20a8 8 0 01-8-8z"
                ></path>
              </svg>
            )}
            {!otpSent ? "Send OTP" : !otpVerified ? "Verify OTP" : "Set New Password"}
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-center ${otpVerified ? "text-green-700" : "text-red-700"}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
