"use client";

import React, { useEffect, useState } from "react";
import Header from "../../../../components/StudentHeader";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

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
const storage = firebase.storage();

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    fullname: "",
    studentId: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
  });
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [studentDocId, setStudentDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: "", message: "" });
  const [imgPopup, setImgPopup] = useState(false);
  const [imgUrlInput, setImgUrlInput] = useState("");

  // New: Student ID live check
  const [studentIdStatus, setStudentIdStatus] = useState<{message: string, color: string}>({ message: "", color: "" });
  const [checkingId, setCheckingId] = useState(false);

  const [loggedEmail, setLoggedEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("loggedStudentEmail") || "";
      setLoggedEmail(email);
    }
  }, []);
  

  useEffect(() => {
   
    if (loggedEmail === "") return;
  
    if (!loggedEmail) {
      alert("No student logged in!");
      window.location.href = "/auth/login";
      return;
    }
  
    const loadProfile = async () => {
      try {
        const snapshot = await db
          .collection("students")
          .where("email", "==", loggedEmail)
          .limit(1)
          .get();
        if (snapshot.empty) {
          alert("Student not found!");
          return;
        }
        const doc = snapshot.docs[0];
        setStudentDocId(doc.id);
        const data = doc.data();
        setProfile({
          fullname: data.fullname || "",
          studentId: data.studentId || "",
          dob: data.dob || "",
          gender: data.gender || "",
          email: data.email || "",
          phone: data.phone || "",
        });
        setProfilePicUrl(data.profilePicUrl || "");
      } catch (err) {
        console.error(err);
        alert("Error loading profile.");
      } finally {
        setLoading(false);
      }
    };
  
    loadProfile();
  }, [loggedEmail]);
  

  // Handle input changes
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // Live check for studentId
    if (name === "studentId") {
      if (!value) {
        setStudentIdStatus({ message: "", color: "" });
        return;
      }
      setCheckingId(true);
      try {
        const snapshot = await db
          .collection("students")
          .where("studentId", "==", value)
          .get();
        // If editing own ID, ignore current doc
        const isTaken = snapshot.docs.some(doc => doc.id !== studentDocId);
        if (isTaken) {
          setStudentIdStatus({ message: "Student ID already taken ❌", color: "red" });
        } else {
          setStudentIdStatus({ message: "Student ID available ✅", color: "green" });
        }
      } catch (err) {
        console.error(err);
        setStudentIdStatus({ message: "Error checking ID", color: "red" });
      } finally {
        setCheckingId(false);
      }
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!studentDocId) return;
    if (studentIdStatus.color === "red") {
      alert("Please choose a different Student ID.");
      return;
    }
    setSaveLoading(true);
    try {
      await db.collection("students").doc(studentDocId).update({
        ...profile,
        profilePicUrl,
      });
      localStorage.setItem("loggedStudentName", profile.fullname);
      setPopup({ show: true, title: "Success", message: "Profile updated successfully!" });
    } catch (err) {
      console.error(err);
      setPopup({ show: true, title: "Error", message: "Failed to save changes!" });
    } finally {
      setSaveLoading(false);
    }
  };

  // Skeleton loader
  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-gray-300 animate-pulse rounded ${className}`}></div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10 relative">
        <h1 className="text-3xl font-bold text-teal-800 mb-8 text-center sm:text-left animate-fadeDown">
          Student Profile
        </h1>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-8">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="w-36 h-36 rounded-full" />
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
            <div className="flex flex-col gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="w-full h-12" />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-8 animate-fadeUp">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <img
                src={profilePicUrl || "/images/default-profile.png"}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-teal-800 object-cover mb-4 transition-transform hover:scale-105 cursor-pointer"
                onClick={() => setImgPopup(true)}
              />
              <button
                className="bg-teal-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-teal-800 transition transform hover:scale-105"
                onClick={() => setImgPopup(true)}
              >
                Change Picture
              </button>
            </div>

            {/* Profile Details */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-semibold text-teal-800 mb-1">Full Name:</label>
                <input
                  type="text"
                  name="fullname"
                  value={profile.fullname}
                  onChange={handleChange}
                  className="w-full p-3 text-[#000] border rounded-lg border-gray-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-200 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-teal-800 mb-1">Student ID:</label>
                <input
                  type="text"
                  name="studentId"
                  value={profile.studentId}
                  onChange={handleChange}
                  className="w-full p-3 text-[#000] border rounded-lg border-gray-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-200 transition"
                />
                {checkingId ? (
                  <p className="text-gray-500 text-sm mt-1">Checking...</p>
                ) : (
                  studentIdStatus.message && (
                    <p className={`text-sm mt-1`} style={{ color: studentIdStatus.color }}>
                      {studentIdStatus.message}
                    </p>
                  )
                )}
              </div>

              <div>
                <label className="block font-semibold text-teal-800 mb-1">Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleChange}
                  className="w-full p-3 text-[#000] border rounded-lg border-gray-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-200 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-teal-800 mb-1">Gender:</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full p-3 text-[#000] border rounded-lg border-gray-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-200 transition"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-teal-800 mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full p-3 text-[#000] border rounded-lg border-gray-300 bg-gray-200 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-teal-800 mb-1">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full p-3 text-[#000] border rounded-lg border-gray-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-200 transition"
                />
              </div>

              <button
                className="w-full py-3 bg-teal-800 text-white rounded-lg font-semibold hover:bg-yellow-400 hover:text-teal-800 transition transform hover:scale-105 mt-4 flex justify-center items-center gap-2"
                onClick={handleSave}
                disabled={saveLoading || studentIdStatus.color === "red"}
              >
                {saveLoading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Image URL Popup */}
        {imgPopup && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-11/12 max-w-md text-center animate-zoomIn">
              <h2 className="text-xl font-bold text-teal-800 mb-4">Enter Image URL</h2>
              <input
                type="text"
                value={imgUrlInput}
                onChange={(e) => setImgUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border rounded-lg text-[#000] border-gray-300 focus:border-teal-800 focus:ring-2 focus:ring-teal-200 mb-4 transition"
              />
              <div className="flex justify-between gap-4">
                <button
                  className="flex-1 py-2 bg-teal-800 text-white rounded-lg hover:bg-yellow-400 hover:text-teal-800 transition"
                  onClick={() => {
                    if (!imgUrlInput) return alert("Please enter URL!");
                    setProfilePicUrl(imgUrlInput);
                    setImgPopup(false);
                    setImgUrlInput("");
                    setPopup({ show: true, title: "Success ✅", message: "Profile picture URL set!" });
                  }}
                >
                  Save
                </button>
                <button
                  className="flex-1 py-2 bg-gray-300  text-[#000] rounded-lg hover:bg-gray-400 transition"
                  onClick={() => setImgPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Message */}
        {popup.show && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-11/12 max-w-sm text-center animate-zoomIn">
              <h2 className="text-xl font-bold text-teal-800 mb-2">{popup.title}</h2>
              <p className="mb-4 text-[#000]">{popup.message}</p>
              <button
                className="py-2 px-4 bg-teal-800 text-white rounded-lg hover:bg-yellow-400 hover:text-teal-800 transition"
                onClick={() => setPopup({ ...popup, show: false })}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.7s forwards; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeDown { animation: fadeDown 0.7s forwards; }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoomIn { animation: zoomIn 0.3s forwards; }
      `}</style>
    </div>
  );
}
