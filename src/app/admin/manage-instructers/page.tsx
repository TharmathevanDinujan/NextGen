"use client";

import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Header from "../../../../components/AdminHeader"; // your sidebar + header component

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

interface Instructor {
  fullname: string;
  instructorID: string;
  email: string;
  password: string;
  id?: string;
}

export default function ManageInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [suspendId, setSuspendId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Instructor>({
    fullname: "",
    instructorID: "",
    email: "",
    password: "",
  });
  const [idError, setIdError] = useState<string | null>(null);
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = db
      .collection("instructors")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const list: Instructor[] = [];
        snapshot.forEach((doc) =>
          list.push({ ...(doc.data() as Instructor), id: doc.id })
        );
        setInstructors(list);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  const openModal = (instructor?: Instructor) => {
    if (instructor) {
      setEditId(instructor.id || null);
      setFormData(instructor);
    } else {
      setEditId(null);
      setFormData({ fullname: "", instructorID: "", email: "", password: "" });
    }
    setIdError(null);
    setIdAvailable(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);
  const openSuspendModal = (id: string) => {
    setSuspendId(id);
    setSuspendModalOpen(true);
  };
  const closeSuspendModal = () => setSuspendModalOpen(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "instructorID") {
      if (value.trim() === "") {
        setIdError(null);
        setIdAvailable(null);
        return;
      }
      const snapshot = await db
        .collection("instructors")
        .where("instructorID", "==", value.trim())
        .get();
      if (!snapshot.empty && snapshot.docs[0].id !== editId) {
        setIdError("Instructor ID already exists");
        setIdAvailable(false);
      } else {
        setIdError(null);
        setIdAvailable(true);
      }
    }
  };

  const isFormValid = () => {
    return Object.values(formData).every((val) => val !== "") && !idError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    if (editId) {
      await db.collection("instructors").doc(editId).update(formData);
      setSuccessMsg("Instructor updated successfully!");
    } else {
      await db
        .collection("instructors")
        .add({ ...formData, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setSuccessMsg("Instructor added successfully!");
    }

    closeModal();
    setEditId(null);
    setIdAvailable(null);

    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSuspend = async () => {
    if (!suspendId) return;
    await db.collection("instructors").doc(suspendId).delete();
    closeSuspendModal();
    setSuspendId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      {/* Success Message */}
      {successMsg && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-slide-down text-center">
            {successMsg}
          </div>
        </div>
      )}

      {/* Header + Sidebar Component */}
      <Header />

      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Manage Instructors</h1>
          <button
            onClick={() => openModal()}
            className="bg-[#009688] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#00796b] transition transform hover:scale-105 mt-3"
          >
            ➕ Add Instructor
          </button>
        </div>

        {/* Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-5 animate-pulse w-full"
              >
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {instructors.map((inst) => (
              <div
                key={inst.id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center transition transform hover:-translate-y-1 hover:shadow-lg w-full"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{inst.fullname}</h3>
                  <p className="text-gray-500 text-sm">
                    Email: {inst.email} | ID: {inst.instructorID}
                  </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => openModal(inst)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openSuspendModal(inst.id!)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-600 transform hover:scale-105 transition"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-[#004d40] text-white rounded-xl w-full max-w-lg p-6 m-4 animate-slide-down z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex-1 text-center">
                {editId ? "Edit Instructor" : "Add Instructor"}
              </h2>
              <span className="text-2xl font-bold text-red-400 cursor-pointer" onClick={closeModal}>
                &times;
              </span>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              {["fullname", "instructorID", "email", "password"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-semibold capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={
                      field === "password"
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    id={field}
                    value={(formData as any)[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md text-white bg-[#004d40] border border-white focus:border-black outline-none"
                    required
                  />
                  {field === "instructorID" && (
                    <p
                      className={`mt-1 text-sm ${
                        idError ? "text-red-400" : idAvailable ? "text-green-400" : ""
                      }`}
                    >
                      {idError ? idError : idAvailable ? "Instructor ID available ✅" : ""}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="submit"
                  className="bg-[#009688] px-4 py-2 rounded-lg font-semibold hover:bg-[#00796b] transition transform hover:scale-105"
                  disabled={!isFormValid()}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {suspendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeSuspendModal}></div>
          <div className="relative bg-[#004d40] text-white rounded-xl w-full max-w-md p-6 m-4 z-10">
            <h3 className="text-xl font-bold mb-4 text-center">
              Suspend Instructor?
            </h3>
            <p className="text-center mb-4">
              Do you really want to suspend this instructor? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSuspend}
                className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition mx-9 transform hover:scale-105"
              >
                Yes, Suspend
              </button>
              <button
                onClick={closeSuspendModal}
                className="bg-gray-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 mx-9 transition transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease;
        }
      `}</style>
    </div>
  );
}
