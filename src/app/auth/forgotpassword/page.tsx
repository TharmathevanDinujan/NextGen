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
import VisitorHeader from "../../../../components/VisitorHeader";

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
      <div className="font-[Poppins] bg-[#e0f2f1] text-[#333] min-h-screen flex flex-col">
        <VisitorHeader />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-teal-100">
          <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Password Reset Successful!</h2>
            <p className="text-teal-100 text-lg mb-6">Your password has been updated. Redirecting to login page...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
        <footer className="bg-teal-900 text-teal-100 text-center py-4 mt-auto">
          &copy; 2025 NextGen Institute. All Rights Reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="font-[Poppins] bg-[#e0f2f1] text-[#333] min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full flex-shrink-0">
        <VisitorHeader />
      </div>

      {/* Main content */}
      <div className="flex-1 flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 sm:m-6">
          <div className="text-center mb-6">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-2">Forgot Password</h2>
            <p className="text-teal-100 text-lg">Reset your password in 3 simple steps</p>
          </div>

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
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`flex items-center ${!otpSent ? 'text-white' : 'text-teal-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!otpSent ? 'bg-white text-teal-900' : 'bg-teal-200 text-teal-900'}`}>
                  {otpSent ? '✓' : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Email</span>
              </div>
              <div className={`w-12 h-0.5 ${otpSent ? 'bg-white' : 'bg-teal-200'}`}></div>
              <div className={`flex items-center ${otpSent && !otpVerified ? 'text-white' : otpVerified ? 'text-white' : 'text-teal-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${otpSent && !otpVerified ? 'bg-white text-teal-900' : otpVerified ? 'bg-white text-teal-900' : 'bg-teal-200 text-teal-900'}`}>
                  {otpVerified ? '✓' : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">OTP</span>
              </div>
              <div className={`w-12 h-0.5 ${otpVerified ? 'bg-white' : 'bg-teal-200'}`}></div>
              <div className={`flex items-center ${otpVerified ? 'text-white' : 'text-teal-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${otpVerified ? 'bg-white text-teal-900' : 'bg-teal-200 text-teal-900'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Password</span>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block font-semibold mb-1 text-white">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern text-black"
                required
                disabled={otpSent}
              />
              {/* Live Email Status */}
              {email && (
                <p
                  className={`mt-2 text-sm flex items-center gap-1 ${
                    emailExists === null
                      ? "text-yellow-300"
                      : emailExists
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {emailExists === null ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3 3 3V20a8 8 0 01-8-8z"></path>
                      </svg>
                      Checking email...
                    </>
                  ) : emailExists ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Email verified
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Email not found
                    </>
                  )}
                </p>
              )}
            </div>

            {/* OTP Input */}
            {otpSent && !otpVerified && (
              <div>
                <label className="block font-semibold mb-1 text-white">Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-modern text-black text-center text-2xl tracking-widest font-bold"
                  required
                  maxLength={6}
                />
                <p className="mt-2 text-sm text-teal-100">Check your email for the OTP code</p>
              </div>
            )}

            {/* New Password Input */}
            {otpVerified && (
              <div>
                <label className="block font-semibold mb-1 text-white">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password (min. 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-modern text-black"
                  required
                  minLength={8}
                />
                {newPassword && (
                  <p className={`mt-2 text-sm ${newPassword.length >= 8 ? 'text-green-300' : 'text-yellow-300'}`}>
                    {newPassword.length >= 8 ? '✓ Password strength: Good' : `⚠ Need ${8 - newPassword.length} more characters`}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full font-bold py-3 rounded-xl transition-all duration-300 btn-modern-icon btn-modern-primary bg-white text-teal-900 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading || (email && !emailExists)}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3 3 3V20a8 8 0 01-8-8z"></path>
                  </svg>
                  {!otpSent ? "Sending OTP..." : !otpVerified ? "Verifying..." : "Updating Password..."}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {!otpSent ? (
                    <>
                      <span>Send OTP</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </>
                  ) : !otpVerified ? (
                    <>
                      <span>Verify OTP</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Set New Password</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </>
                  )}
                </span>
              )}
            </button>
          </form>

          {status && (
            <div className={`mt-4 p-4 rounded-xl text-center ${
              status.includes("success") || status.includes("verified") || otpVerified
                ? "bg-green-500/20 text-green-200 border border-green-400/30"
                : "bg-red-500/20 text-red-200 border border-red-400/30"
            }`}>
              <p className="font-medium">{status}</p>
            </div>
          )}

          <p className="text-lg text-center mt-6 text-teal-100">
            Remember your password?{" "}
            <a href="/auth/login" className="underline font-semibold hover:text-white transition-colors">
              Login
            </a>
          </p>
        </div>
      </div>

      <footer className="bg-teal-900 text-teal-100 text-center py-4 mt-auto">
        &copy; 2025 NextGen Institute. All Rights Reserved.
      </footer>
    </div>
  );
}
