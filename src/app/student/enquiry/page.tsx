"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../../components/StudentHeader";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Firebase initialization
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyA2wwTdPSgNjcyoxjPDU_00ceGaU882XC8",
  authDomain: "nextgen-9de89.firebaseapp.com",
  projectId: "nextgen-9de89",
  storageBucket: "nextgen-9de89.firebasestorage.app",
  messagingSenderId: "446092918649",
  appId: "1:446092918649:web:4c83d7349c62e33cb279a8"

  });
}
const db = firebase.firestore();

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const [loadingBtn, setLoadingBtn] = useState(false);

  // ---------------- Auto-fill email from localStorage ----------------
  useEffect(() => {
    const loggedEmail = localStorage.getItem("loggedStudentEmail") || "";
    setFormData((prev) => ({ ...prev, email: loggedEmail }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let hasError = false;
    const newErrors = { fullname: "", email: "", subject: "", message: "" };

    if (!formData.fullname.trim()) { newErrors.fullname = "Required"; hasError = true; }
    if (!formData.subject.trim()) { newErrors.subject = "Required"; hasError = true; }
    if (!formData.message.trim()) { newErrors.message = "Required"; hasError = true; }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoadingBtn(true);
    try {
      await db.collection("studentEnquiries").add({
        ...formData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setPopup({ show: true, title: "Success ✅", message: "Your enquiry has been sent successfully!" });
      setFormData({ fullname: "", email: formData.email, subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setPopup({ show: true, title: "Error ❌", message: "Failed to send enquiry. Please try again." });
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins relative">
      <Header />

      <main className={`flex justify-center items-start p-4 sm:p-8 transition-all duration-500 ${popup.show ? "blur-sm pointer-events-none select-none" : ""}`}>
        <section className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg animate-fadeUp">
          <h1 className="text-3xl font-bold text-teal-800 mb-6 text-center">Submit Your Enquiry</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col relative">
              <label htmlFor="fullname" className="font-semibold text-[#000] mb-1">Full Name:</label>
              <input
                type="text"
                name="fullname"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-[#000] focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${errors.fullname ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.fullname && <span className="text-red-600 text-sm absolute bottom-[-18px]">{errors.fullname}</span>}
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="email" className="font-semibold text-[#000] mb-1">Email Address:</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                readOnly
                className="p-3 rounded-lg border bg-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="subject" className="font-semibold text-[#000] mb-1">Subject:</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-[#000] focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${errors.subject ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.subject && <span className="text-red-600 text-sm absolute bottom-[-18px]">{errors.subject}</span>}
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="message" className="font-semibold text-[#000] mb-1">Message:</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={`p-3 rounded-lg border text-[#000] focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none ${errors.message ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.message && <span className="text-red-600 text-sm absolute bottom-[-18px]">{errors.message}</span>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-teal-600 transform hover:scale-105 transition"
              disabled={loadingBtn}
            >
              {loadingBtn && (
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
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loadingBtn ? "Sending..." : "Send Enquiry"}
            </button>
          </form>
        </section>
      </main>

      {/* Popup */}
      {popup.show && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white p-8 rounded-xl shadow-lg w-11/12 max-w-md text-center animate-zoomIn">
            <h3 className="text-2xl font-bold mb-3">{popup.title}</h3>
            <p className="mb-5">{popup.message}</p>
            <button
              className="px-6 py-2 bg-white text-teal-900 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition"
              onClick={() => setPopup({ ...popup, show: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.7s forwards; }

        @keyframes zoomIn {
          from { opacity:0; transform:scale(0.8);}
          to { opacity:1; transform:scale(1);}
        }
        .animate-zoomIn { animation: zoomIn 0.4s ease forwards; }
      `}</style>
    </div>
  );
}
