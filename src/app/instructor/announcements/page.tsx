"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../../../components/InstructerHeader"; // Import Sidebar component
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

interface Announcement {
  id: string;
  title: string;
  message: string;
  eventDate?: string;
  status?: string;
  createdAt?: firebase.firestore.Timestamp;
}

export default function Announcements() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const db = firebase.firestore();

  // Open/Close Modal
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Save New Announcement
  const saveAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please enter a title and message");
      return;
    }

    try {
      await db.collection("announcements").add({
        title,
        message,
        eventDate,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "published",
      });

      setTitle("");
      setMessage("");
      setEventDate("");
      closeModal();
    } catch (error) {
      console.error("Error adding announcement: ", error);
    }
  };

  // Real-time Listener
  useEffect(() => {
    const unsubscribe = db
      .collection("announcements")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Announcement[];
          setAnnouncements(data);
          setLoading(false);
        },
        (err) => {
          console.error("Error loading announcements:", err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [db]);

  // Skeleton UI
  const renderSkeleton = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="bg-white p-5 rounded-xl shadow-md animate-pulse h-40 relative"
      >
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    ));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`flex-1 p-4 md:p-6 md:ml-64 transition-all duration-300 ${
          modalOpen ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <header className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            Announcements
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Create and manage announcements for your students.
          </p>
        </header>

        <div className="mb-4">
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-teal-600 to-teal-400 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition-transform"
          >
            ➕ New Announcement
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? renderSkeleton()
            : announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white p-5 rounded-xl shadow-md relative transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{ann.title}</h3>
                  <p className="text-gray-600 mb-2">{ann.message}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    <strong>Event Date:</strong> {ann.eventDate || "N/A"}
                  </p>
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full text-white ${
                      ann.status === "draft" ? "bg-yellow-500" : "bg-green-600"
                    }`}
                  >
                    {ann.status || "Published"}
                  </span>
                </div>
              ))}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* No black overlay */}
          <div className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-lg z-10">
            <h2 className="text-lg font-bold text-teal-800 mb-4">New Announcement</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={saveAnnouncement}
                  className="bg-gradient-to-r from-teal-700 to-teal-500 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
