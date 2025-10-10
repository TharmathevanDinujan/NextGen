"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../../../components/InstructerHeader"; // Import your Sidebar component
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

interface Enquiry {
  id: string;
  type: "student" | "visitor";
  subject: string;
  fullname: string;
  email: string;
  message: string;
  timestamp?: firebase.firestore.Timestamp;
}

export default function ViewEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<"all" | "student" | "visitor">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const fetchCollection = async (collectionName: string) => {
      const snapshot = await db.collection(collectionName).orderBy("timestamp", "desc").get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        type: collectionName === "studentEnquiries" ? "student" : "visitor",
        ...doc.data(),
      })) as Enquiry[];
    };

    const loadEnquiries = async () => {
      try {
        const studentEnquiries = await fetchCollection("studentEnquiries");
        const visitorEnquiries = await fetchCollection("visitorinquiries");
        const allEnquiries = [...studentEnquiries, ...visitorEnquiries];

        allEnquiries.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setEnquiries(allEnquiries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEnquiries();
  }, []);

  const isNewEnquiry = (timestamp?: firebase.firestore.Timestamp) => {
    if (!timestamp?.toDate) return false;
    const enquiryDate = timestamp.toDate();
    const now = new Date();
    const diffHours = (now.getTime() - enquiryDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const filteredEnquiries =
    filter === "all" ? enquiries : enquiries.filter((e) => e.type === filter);

  // Skeleton UI for loading state
  const renderSkeleton = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="bg-white p-4 md:p-5 rounded-xl shadow-lg animate-pulse h-36 md:h-40"
      >
        <div className="bg-gray-300 h-5 w-3/4 mb-2 rounded"></div>
        <div className="bg-gray-200 h-3 w-5/6 mb-1 rounded"></div>
        <div className="bg-gray-200 h-3 w-5/6 mb-1 rounded"></div>
        <div className="bg-gray-200 h-3 w-full rounded"></div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64">
        <header className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-teal-900 mb-1">
            Instructor Enquiries
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Review recent student and visitor enquiries.
          </p>
        </header>

        {/* Filter Buttons */}
        <div className="flex gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
          {["all", "student", "visitor"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as "all" | "student" | "visitor")}
              className={`px-3 md:px-4 py-2 md:py-2 rounded-lg font-semibold text-sm md:text-base transition-colors ${
                filter === type
                  ? "bg-teal-900 text-white"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Enquiries Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {renderSkeleton()}
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <p>No enquiries found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredEnquiries.map((enquiry) => {
              const dateObj = enquiry.timestamp?.toDate
                ? enquiry.timestamp.toDate()
                : new Date();
              const dateStr = dateObj.toLocaleDateString();
              const timeStr = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={enquiry.id}
                  className={`bg-white p-4 md:p-5 rounded-xl shadow-lg transform transition-all duration-400 ${
                    isNewEnquiry(enquiry.timestamp)
                      ? "border-l-4 border-teal-600 "
                      : ""
                  }`}
                >
                  <h3 className="text-teal-800 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    {enquiry.subject}
                  </h3>
                  <p className="text-gray-800 text-xs md:text-sm">
                    <strong>Name:</strong> {enquiry.fullname}
                  </p>
                  <p className="text-gray-800 text-xs md:text-sm">
                    <strong>Email:</strong> {enquiry.email}
                  </p>
                  <p className="text-gray-800 text-xs md:text-sm mb-1 md:mb-2">
                    <strong>Message:</strong> {enquiry.message}
                  </p>
                  <div className="text-right text-xs md:text-[0.7rem] text-gray-500">
                    {dateStr} | {timeStr}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
