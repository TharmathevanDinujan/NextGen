"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../../../components/InstructerHeader";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getSession } from "@/lib/auth";

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

export default function InstructorProfile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [instructorID, setInstructorID] = useState("");
  const [faculty, setFaculty] = useState("");
  const [qualification, setQualification] = useState("");
  const [branch, setBranch] = useState<string[]>([]);
  const [lecturerType, setLecturerType] = useState("full-time");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
  const [picPopupOpen, setPicPopupOpen] = useState(false);
  const [newPicUrl, setNewPicUrl] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const db = firebase.firestore();

  useEffect(() => {
    const fetchProfile = async () => {
      // Use session system instead of old localStorage
      const session = getSession("instructor");
      let instructorDocId: string | null = null;
      
      if (session && session.docId) {
        instructorDocId = session.docId;
        // Also set old localStorage items for backward compatibility
        localStorage.setItem("instructorDocId", instructorDocId);
      } else {
        // Fallback to old localStorage
        instructorDocId = localStorage.getItem("instructorDocId");
      }
      
      if (!instructorDocId) {
        alert("Please login first!");
        window.location.href = "/auth/login";
        return;
      }

      try {
        const docRef = db.collection("instructors").doc(instructorDocId);
        const docSnap = await docRef.get();
        if (!docSnap.exists) throw "Instructor not found";

        const data = docSnap.data();
        if (!data) throw "Instructor data is undefined";

        setFullName(data.fullname || "");
        setEmail(data.email || "");
        setInstructorID(data.instructorID || "");
        setFaculty(data.faculty || "");
        setQualification(data.qualification || "");
        setProfilePic(data.profilePic || "https://via.placeholder.com/150");
        setBranch(data.branch || []);
        setLecturerType(data.lecturerType || "full-time");
      } catch (err) {
        console.error(err);
        alert("Error loading profile. Redirecting to login.");
        window.location.href = "/auth/login.html";
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [db]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use session system instead of old localStorage
    const session = getSession("instructor");
    const instructorDocId = session?.docId || localStorage.getItem("instructorDocId");
    if (!instructorDocId) return;

    setSaving(true);
    try {
      await db.collection("instructors").doc(instructorDocId).update({
        faculty,
        qualification,
        branch,
        lecturerType,
      });
      setNotification({ type: "success", message: "Profile updated successfully!" });
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Error updating profile" });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const openPicPopup = () => {
    setNewPicUrl(profilePic);
    setPicPopupOpen(true);
  };
  const closePicPopup = () => setPicPopupOpen(false);

  const saveProfilePic = async () => {
    // Use session system instead of old localStorage
    const session = getSession("instructor");
    const instructorDocId = session?.docId || localStorage.getItem("instructorDocId");
    if (!instructorDocId) return;

    const url = newPicUrl.trim();
    if (!url) return alert("Enter a valid URL");

    try {
      await db.collection("instructors").doc(instructorDocId).update({ profilePic: url });
      setProfilePic(url);
      setPicPopupOpen(false);
      setNotification({ type: "success", message: "Profile picture updated!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Error updating profile picture" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 md:ml-64 transition-all duration-300 relative">
        {/* Notification Popup */}
        {notification && (
          <div className={`fixed top-4 right-4 px-4 py-3 rounded shadow-lg z-50 text-white font-semibold ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Instructor Profile</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage your personal details and teaching assignments.
          </p>
        </header>

        {/* Profile Card */}
        <section className="bg-white p-6 rounded-xl max-w-2xl mx-auto shadow-lg animate-fadeIn relative">
          {loadingProfile ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-36 w-36 rounded-full bg-gray-300 mx-auto"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="flex flex-col gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6 relative">
                <img
                  src={profilePic}
                  alt="Instructor"
                  className="w-36 h-36 rounded-full border-4 border-teal-600 object-cover mx-auto"
                />
                <button
                  onClick={openPicPopup}
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  Change Picture
                </button>
              </div>

              <form className="flex flex-col gap-4 text-[#000]" onSubmit={handleProfileSave}>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Instructor ID</label>
                  <input type="text" value={instructorID} readOnly className="p-2 border rounded border-gray-300 bg-gray-100" />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Full Name</label>
                  <input type="text" value={fullName} readOnly className="p-2 border rounded border-gray-300 bg-gray-100" />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Email Address</label>
                  <input type="email" value={email} readOnly className="p-2 border rounded border-gray-300 bg-gray-100" />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Faculty</label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="p-2 border rounded border-gray-300"
                  >
                    <option>Science</option>
                    <option>Arts</option>
                    <option>Engineering</option>
                    <option>Business</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Educational Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="p-2 border rounded border-gray-300"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Branch / Courses</label>
                  <select
                    multiple
                    value={branch}
                    onChange={(e) =>
                      setBranch(Array.from(e.target.selectedOptions, (opt) => opt.value))
                    }
                    className="p-2 border rounded border-gray-300 h-24"
                  >
                    <option>Web Development</option>
                    <option>Database Systems</option>
                    <option>Java Programming</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Lecturer Type</label>
                  <div className="flex gap-6 mt-1">
                    <label>
                      <input
                        type="radio"
                        value="full-time"
                        checked={lecturerType === "full-time"}
                        onChange={() => setLecturerType("full-time")}
                        className="accent-teal-600"
                      />{" "}
                      Full-Time
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="part-time"
                        checked={lecturerType === "part-time"}
                        onChange={() => setLecturerType("part-time")}
                        className="accent-teal-600"
                      />{" "}
                      Part-Time
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition mt-4 flex justify-center items-center gap-2"
                  disabled={saving}
                >
                  {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </>
          )}
        </section>

        {/* Profile Picture Popup */}
        {picPopupOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={closePicPopup}></div>
            <div className="relative bg-white p-6 rounded-xl w-full max-w-sm shadow-lg z-10">
              <h2 className="text-lg font-bold text-teal-800 mb-4 text-center">Update Profile Picture URL</h2>
              <input
                type="text"
                className="w-full p-2 border rounded border-gray-300 mb-4"
                value={newPicUrl}
                onChange={(e) => setNewPicUrl(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={saveProfilePic}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={closePicPopup}
                  className="bg-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
