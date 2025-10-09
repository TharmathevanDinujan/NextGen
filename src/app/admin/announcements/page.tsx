"use client";

import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Header from "../../../../components/AdminHeader"; // your header component

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

interface Announcement {
  id: string;
  title: string;
  message: string;
  eventDate?: string;
  status?: "Draft" | "Published";
  createdAt?: firebase.firestore.Timestamp;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [loadingStatusId, setLoadingStatusId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ success popup

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const snapshot = await db
        .collection("announcements")
        .orderBy("createdAt", "desc")
        .get();
      const data: Announcement[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Announcement[];
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingId(announcement.id);
      setTitle(announcement.title);
      setMessage(announcement.message);
      setEventDate(announcement.eventDate || "");
    } else {
      setEditingId(null);
      setTitle("");
      setMessage("");
      setEventDate("");
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const showPopup = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500); // hide after 2.5s
  };

  const saveAnnouncement = async () => {
    if (!title || !message) return alert("Title and Message are required!");
    const data = {
      title,
      message,
      eventDate,
      status: "Draft",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
      if (editingId) {
        await db.collection("announcements").doc(editingId).update(data);
      } else {
        await db.collection("announcements").add(data);
      }
      closeModal();
      loadAnnouncements();
      showPopup(); // ✅ success popup trigger
    } catch (err) {
      console.error(err);
      alert("Failed to save announcement.");
    }
  };

  const toggleStatus = async (id: string) => {
    setLoadingStatusId(id);
    const docRef = db.collection("announcements").doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const currentStatus = docSnap.data()?.status;
      await docRef.update({
        status: currentStatus === "Published" ? "Draft" : "Published",
      });
      await loadAnnouncements();
    }
    setLoadingStatusId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Header component as sidebar on desktop, top header on mobile */}
      <Header />

      <main className="flex-1 md:ml-64 p-4 md:p-6 pt-20 md:pt-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 md:gap-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Announcements
          </h1>
          <button
            onClick={() => openModal()}
            className="bg-[#009688] hover:bg-[#00796b] text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
          >
            ➕ Create New Announcement
          </button>
        </div>

        {loading ? (
          // ✅ Skeleton loader while fetching
          <div className="grid gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow-md animate-pulse"
              >
                <div className="h-5 w-1/3 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded ml-auto"></div>
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No announcements found.
          </p>
        ) : (
          <div className="grid gap-5">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`bg-white p-5 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center transition transform hover:-translate-y-1 hover:shadow-lg border-l-4 ${
                  ann.status === "Published"
                    ? "border-[#009688]"
                    : "border-[#f39c12]"
                }`}
              >
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {ann.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">{ann.message}</p>
                  <p className="text-gray-500 text-xs">
                    Event: {ann.eventDate || "-"} | Status:{" "}
                    <strong>{ann.status}</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(ann.id)}
                    disabled={loadingStatusId === ann.id}
                    className={`flex items-center justify-center gap-1 bg-[#009688] hover:bg-[#00796b] text-white px-3 py-1 rounded-md text-sm font-semibold transition ${
                      loadingStatusId === ann.id ? "cursor-wait" : ""
                    }`}
                  >
                    {loadingStatusId === ann.id ? (
                      <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                    ) : ann.status === "Published" ? (
                      "Unpublish"
                    ) : (
                      "Publish"
                    )}
                  </button>
                  <button
                    onClick={() => openModal(ann)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Success popup */}
        {showSuccess && (
          <div className="fixed top-6 right-6 bg-[#009688] text-white px-6 py-3 rounded-lg shadow-lg animate-slideIn z-50">
            ✅ Announcement saved successfully!
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg text-[#000]">
              <h2 className="text-xl font-bold text-[#004d40] mb-4">
                {editingId ? "Edit Announcement" : "New Announcement"}
              </h2>
              <label className="block font-semibold mt-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
              <label className="block font-semibold mt-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full p-2 border rounded mt-1"
              />
              <label className="block font-semibold mt-2">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={saveAnnouncement}
                  className="bg-[#004d40] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#00332a] transition"
                >
                  Save
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
