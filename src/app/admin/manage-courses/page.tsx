"use client";

import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Header from "../../../../components/AdminHeader"; // ✅ Header component import

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

interface Course {
  courseName: string;
  imageUrl: string;
  category: string;
  location: string;
  duration: string;
  instructor: string;
  courseFee: string;
  university: string;
  id?: string;
}

export default function ManageCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Course>({
    courseName: "",
    imageUrl: "",
    category: "",
    location: "",
    duration: "",
    instructor: "",
    courseFee: "",
    university: "",
  });
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const snapshot = await db.collection("courses").get();
    const coursesData: Course[] = [];
    snapshot.forEach((doc) =>
      coursesData.push({ ...(doc.data() as Course), id: doc.id })
    );
    setCourses(coursesData);
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const openModal = (course?: Course) => {
    if (course) {
      setEditCourseId(course.id || null);
      setFormData(course);
    } else {
      setEditCourseId(null);
      setFormData({
        courseName: "",
        imageUrl: "",
        category: "",
        location: "",
        duration: "",
        instructor: "",
        courseFee: "",
        university: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);
  const closeDeletePopup = () => setDeleteConfirm(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const isFormValid = () => {
    return Object.values(formData).every((val) => val !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      showToast("Please fill all fields!");
      return;
    }

    if (editCourseId) {
      await db.collection("courses").doc(editCourseId).update(formData);
      showToast("Course updated successfully!");
    } else {
      await db.collection("courses").add(formData);
      showToast("Course added successfully!");
    }
    closeModal();
    loadCourses();
    setEditCourseId(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await db.collection("courses").doc(deleteConfirm).delete();
    showToast("Course deleted!");
    closeDeletePopup();
    loadCourses();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      {/* ✅ Admin Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64 relative">
        {/* Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Manage Courses</h1>
          <button
            onClick={() => openModal()}
            className="bg-[#009688] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#00796b] transition transform hover:scale-105 mt-5"
          >
            ➕ Add New Course
          </button>
        </div>

        {/* Courses or Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md p-5 animate-pulse"
                  >
                    <div className="flex items-center mb-3 space-x-4">
                      <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                ))
            : courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row justify-between items-start md:items-center transition transform hover:-translate-y-1 hover:shadow-lg w-full"
                >
                  <div className="flex items-center mb-3 md:mb-0 w-full md:w-auto">
                    <img
                      src={course.imageUrl}
                      alt="course"
                      className="w-20 h-20 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {course.courseName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Instructor: {course.instructor} | Fee: LKR{" "}
                        {course.courseFee} | Duration: {course.duration} |
                        Location: {course.location}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Category: {course.category} | University:{" "}
                        {course.university}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => openModal(course)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(course.id || null)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-600 transform hover:scale-105 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={closeModal}
          ></div>

          <div
            className="relative bg-[#004d40] text-white rounded-xl w-full max-w-4xl p-6 m-4 animate-slide-down z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-center flex-1">
                Add / Edit Course
              </h2>
              <span
                className="text-2xl font-bold text-red-400 cursor-pointer"
                onClick={closeModal}
              >
                &times;
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { id: "courseName", label: "Course Name", type: "text" },
                { id: "imageUrl", label: "Image URL", type: "url" },
                { id: "instructor", label: "Instructor", type: "text" },
                { id: "courseFee", label: "Course Fee (LKR)", type: "number" },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block mb-1 font-semibold">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id as keyof Course]}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md text-white border border-white bg-[#004d40]"
                    required
                  />
                </div>
              ))}

              {/* Dropdowns */}
              {[
                {
                  id: "category",
                  label: "Category",
                  options: [
                    "",
                    "Programming",
                    "Hospitality",
                    "Data Science",
                    "Networking",
                    "Language",
                  ],
                },
                {
                  id: "location",
                  label: "Location",
                  options: ["", "Jaffna", "Colombo", "Kandy"],
                },
                {
                  id: "duration",
                  label: "Duration",
                  options: ["", "6 Months", "1 Year", "2 Years"],
                },
                {
                  id: "university",
                  label: "Awarding University",
                  options: [
                    "",
                    "University of London",
                    "University of Cambridge",
                    "University of Oxford",
                    "University of Manchester",
                    "University of Birmingham",
                    "University of Edinburgh",
                  ],
                },
              ].map((select) => (
                <div key={select.id}>
                  <label className="block mb-1 font-semibold">
                    {select.label}
                  </label>
                  <select
                    id={select.id}
                    value={formData[select.id as keyof Course]}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md text-white border border-white bg-[#004d40]"
                    required
                  >
                    {select.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt === "" ? `-- Select ${select.label} --` : opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="col-span-full text-center mt-4">
                <button
                  type="submit"
                  className="bg-[#009688] px-5 py-2 rounded-lg font-semibold hover:bg-[#00796b] transition transform hover:scale-105"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDeletePopup}
          ></div>

          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center z-10 animate-slide-down">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this course?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeletePopup}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed left-1/2 bottom-8 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg font-semibold animate-fade">
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          0% {
            transform: translateY(-30px);
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
        @keyframes fade {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-fade {
          animation: fade 3s ease forwards;
        }
      `}</style>
    </div>
  );
}
