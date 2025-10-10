"use client";

import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Header from "../../../../components/AdminHeader"; // your header component

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

interface Inquiry {
  id: string;
  fullname: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: firebase.firestore.Timestamp;
}

export default function ViewInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async (collectionName: string) => {
      const snapshot = await db
        .collection(collectionName)
        .orderBy("timestamp", "desc")
        .get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Inquiry[];
    };

    const fetchInquiries = async () => {
      try {
        const studentEnquiries = await fetchCollection("studentEnquiries");
        const visitorEnquiries = await fetchCollection("visitorinquiries");

        const allEnquiries = [...studentEnquiries, ...visitorEnquiries];
        allEnquiries.sort(
          (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );

        setInquiries(allEnquiries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Header component acts as sidebar on desktop, header on mobile */}
      <Header />

      <main className="flex-1 md:ml-64 p-6 md:pt-10 pt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">View Inquiries</h1>
          <p className="text-gray-600">
            All student and visitor enquiries are listed below.
          </p>
        </div>

        {loading ? (
          // 🔹 Skeleton loading cards
          <div className="grid gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl shadow-md animate-pulse"
              >
                <div className="h-5 w-1/3 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded ml-auto"></div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No enquiries found.</p>
        ) : (
          <div className="grid gap-5">
            {inquiries.map((inq) => {
              const dateObj = inq.timestamp?.toDate
                ? inq.timestamp.toDate()
                : new Date();
              const dateStr = dateObj.toLocaleDateString();
              const timeStr = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={inq.id}
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 animate-fadeUp"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {inq.subject}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">From:</span> {inq.fullname} (
                    {inq.email})
                  </p>
                  <p className="text-gray-600 text-sm mb-2">{inq.message}</p>
                  <div className="text-gray-500 text-xs text-right">
                    {dateStr} | {timeStr}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s forwards;
        }
      `}</style>
    </div>
  );
}
