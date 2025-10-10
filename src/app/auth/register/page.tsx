"use client";

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Register: React.FC = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // 🔍 Live email check from Firestore
  useEffect(() => {
    const checkEmailExists = async () => {
      if (form.email.trim().length === 0) {
        setEmailExists(false);
        return;
      }

      setCheckingEmail(true);
      const q = query(
        collection(db, "students"),
        where("email", "==", form.email)
      );
      const querySnapshot = await getDocs(q);
      setEmailExists(!querySnapshot.empty);
      setCheckingEmail(false);
    };

    const timeout = setTimeout(() => {
      checkEmailExists();
    }, 600); // debounce for performance

    return () => clearTimeout(timeout);
  }, [form.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs: any = {};
    if (!form.fullname.trim()) errs.fullname = "Full Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[\w.-]+@[\w.-]+\.\w{2,6}$/.test(form.email))
      errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Phone must be 10 digits";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8)
      errs.password = "Password must be 8+ characters";
    if (!form.confirmPassword)
      errs.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    // ❌ Stop if email already exists
    if (emailExists) {
      setErrors({ ...validationErrors, email: "This email is already registered" });
      return;
    }

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await addDoc(collection(db, "students"), {
        ...form,
        role: "student",
        createdAt: serverTimestamp(),
      });
      setShowModal(true);
      setForm({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000);
    } catch (err) {
      alert("Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="font-[Poppins] bg-[#e0f2f1] text-[#333] min-h-screen flex flex-col relative">
      <VisitorHeader />

      <div className="px-4 pt-10 pb-20 flex justify-center">
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-xl shadow-lg p-8 w-full max-w-md relative z-10">
          <h2 className="text-white text-2xl font-bold mb-2 text-center">
            Create an Account
          </h2>
          <p className="text-teal-100 text-lg mb-6 text-center">
            Join NextGen Institute and start your journey today!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="fullname" className="text-teal-100 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                className="rounded-lg p-3 text-black w-full bg-white border border-black"
              />
              {errors.fullname && (
                <span className="text-red-400 text-sm">{errors.fullname}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-teal-100 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="rounded-lg p-3 text-black w-full bg-white border border-black"
              />
              {checkingEmail && (
                <span className="text-yellow-300 text-sm">Checking email...</span>
              )}
              {emailExists && !checkingEmail && (
                <span className="text-red-400 text-sm">
                  This email is already registered
                </span>
              )}
              {errors.email && !emailExists && (
                <span className="text-red-400 text-sm">{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-teal-100 font-semibold mb-1">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                className="rounded-lg p-3 text-black w-full bg-white border border-black"
              />
              {errors.phone && (
                <span className="text-red-400 text-sm">{errors.phone}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label htmlFor="password" className="text-teal-100 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.password ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="rounded-lg p-3 text-black w-full bg-white border border-black pr-12"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      password: !showPassword.password,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-teal-900"
                >
                  {showPassword.password ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 014.392-8.225m2.367 1.463A9.955 9.955 0 0112 5c5.523 0 10 4.477 10 10a9.96 9.96 0 01-4.392 8.225M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-sm">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col relative">
              <label
                htmlFor="confirmPassword"
                className="text-teal-100 font-semibold mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="rounded-lg p-3 text-black w-full bg-white border border-black pr-12"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirmPassword: !showPassword.confirmPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-teal-900"
                >
                  {showPassword.confirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 014.392-8.225m2.367 1.463A9.955 9.955 0 0112 5c5.523 0 10 4.477 10 10a9.96 9.96 0 01-4.392 8.225M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-400 text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={emailExists}
              className={`w-full font-bold py-3 rounded-lg transition ${
                emailExists
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-white text-teal-900 hover:bg-teal-200"
              }`}
            >
              Register
            </button>
          </form>

          <p className="text-teal-100 text-lg text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="underline font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-lg"></div>
          <div className="relative bg-gradient-to-br from-teal-700 to-teal-900 p-6 rounded-xl text-white text-center w-80 z-10">
            <h3 className="text-xl font-bold mb-2">
              ✅ Account Created Successfully!
            </h3>
            <p>You will be redirected to login shortly...</p>
          </div>
        </div>
      )}

      <footer className="bg-teal-900 text-teal-100 text-center py-4 mt-auto">
        &copy; 2025 NextGen Institute. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Register;
