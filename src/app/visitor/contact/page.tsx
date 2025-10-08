"use client";

import { useState } from "react";
import VisitorHeader from "../../../../components/VisitorHeader";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCnUUk7n_oZQqnjKa11ed_SV5P8AGs1_mU",
    authDomain: "skillpro-64e09.firebaseapp.com",
    projectId: "skillpro-64e09",
    storageBucket: "skillpro-64e09.firebasestorage.app",
    messagingSenderId: "972129736269",
    appId: "1:972129736269:web:787e4bf820828e20716e04",
  });
}

const db = firebase.firestore();

export default function ContactPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [popup, setPopup] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!fullname) newErrors.fullname = "Required";
    if (!email) newErrors.email = "Required";
    if (!subject) newErrors.subject = "Required";
    if (!message) newErrors.message = "Required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await db.collection("visitorinquiries").add({
        fullname,
        email,
        subject,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setPopup({ visible: true, title: "Success ✅", message: "Your inquiry has been sent successfully!" });
      setFullname("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setPopup({ visible: true, title: "Error ❌", message: "Failed to send inquiry. Please try again." });
    }
  };

  const closePopup = () => setPopup({ ...popup, visible: false });

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Header */}
      <VisitorHeader />

      {/* Main content blur when popup visible */}
      <div className={`${popup.visible ? "filter blur-sm" : ""} transition-all duration-300`}>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-teal-900 text-white text-center py-11 px-4 rounded-b-3xl mb-10">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-lg">We’re here to answer your questions about courses, registration, and schedules.</p>
        </section>

        {/* Main Grid */}
        <main className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inquiry Form */}
            <section className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold text-teal-700 mb-6 ">Submit an Inquiry</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="fullname" className="font-medium text-[#060000] mb-1">Full Name:</label>
                  <input
                    type="text"
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="p-3 border text-[#060000] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.fullname && <span className="text-red-600 text-sm">{errors.fullname}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="font-medium text-[#060000] mb-1">Email Address:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border text-[#060000] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="subject" className="font-medium text-[#060000] mb-1">Subject:</label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="p-3 border rounded-lg text-[#060000] focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.subject && <span className="text-red-600 text-sm">{errors.subject}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="message" className="font-medium text-[#060000] mb-1">Message:</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="p-3 border rounded-lg text-[#060000] focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.message && <span className="text-red-600 text-sm">{errors.message}</span>}
                </div>

                <button type="submit" className="bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition">Send Inquiry</button>
              </form>
            </section>

            {/* Contact Info + Map */}
            <section className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-teal-700">Our Location & Contact Info 📍</h2>

              {/* Google Map */}
              <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4050.7711528817117!2d80.01171167511862!3d9.682200878422302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe5408bd5dacd5%3A0x37fefd389fe5cce9!2z4K6v4K6-4K604K-N4K6q4K-N4K6q4K6-4K6j4K6u4K-NIOCuh-CuqOCvjeCupOCvgeCuleCvjSDgrpXgrrLgr43grrLgr4LgrrDgrr8gfCBKYWZmbmEgSGluZHUgQ29sbGVnZQ!5e1!3m2!1sen!2slk!4v1759910039743!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>

              {/* Contact Info Containers */}
              <div className="flex flex-col text-[#000] gap-4">
                <div className="bg-white p-5 rounded-xl shadow-lg">
                  <h3 className="text-teal-600 font-semibold mb-2">Phone</h3>
                  <p>+94 76 190 9286 (General)</p>
                  <p>+94 78 884 8053 (Admissions)</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-lg">
                  <h3 className="text-teal-600 font-semibold mb-2">Email</h3>
                  <p><a href="mailto:info@NextGen.lk" className="text-teal-700 hover:underline">info@NextGen.lk</a></p>
                  <p><a href="mailto:tharmathevandnujan11@gmail.com" className="text-teal-700 hover:underline">tharmathevandnujan11@gmail.com</a></p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-lg">
                  <h3 className="text-teal-600 font-semibold mb-2">Working Hours</h3>
                  <p>Mon - Fri: 8:30 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Popup Modal */}
      {popup.visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-11/12 p-6 text-center animate-fadeIn">
            <h3 className="text-xl font-semibold mb-3 text-teal-800">{popup.title}</h3>
            <p className="mb-5 text-gray-700">{popup.message}</p>
            <button
              onClick={closePopup}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-4 mt-10">
        &copy; 2025 NextGen Institute. All rights reserved.
      </footer>
    </div>
  );
}
