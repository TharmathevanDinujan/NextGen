"use client";

import React, { useEffect, useState } from "react";
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

interface Announcement {
  id: string;
  title: string;
  message: string;
  eventDate: firebase.firestore.Timestamp | string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const snapshot = await db
          .collection("announcements")
          .where("status", "==", "Published")
          .get();

        if (snapshot.empty) {
          setAnnouncements([]);
        } else {
          const data: Announcement[] = snapshot.docs.map((doc) => {
            const ann = doc.data();
            return {
              id: doc.id,
              title: ann.title || "No Title",
              message: ann.message || "No Message",
              eventDate: ann.eventDate || "-",
            };
          });
          setAnnouncements(data);
        }
      } catch (err) {
        console.error(err);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  const formatDate = (date: firebase.firestore.Timestamp | string) => {
    if (typeof date === "string") return date;
    if (date instanceof firebase.firestore.Timestamp) {
      const d = date.toDate();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    }
    return "-";
  };

  // Number of skeleton cards to display while loadine
  const skeletonCount = 4;

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-20 py-10">
        <h1 className="text-3xl font-bold text-teal-800 mb-2 text-center sm:text-left">
          Announcements & Events
        </h1>
        <p className="text-gray-600 mb-6 text-center sm:text-left">
          Stay updated with the latest announcements from SkillPro Institute.
        </p>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500 animate-pulse h-32"
                >
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              ))
            : announcements.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">
                  No announcements published yet.
                </p>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <h3 className="text-teal-800 font-semibold text-lg mb-2">{ann.title}</h3>
                    <p className="text-gray-600 mb-2">{ann.message}</p>
                    <span className="text-gray-400 text-sm">📅 {formatDate(ann.eventDate)}</span>
                  </div>
                ))
              )}
        </div>
      </main>
    </div>
  );
}
