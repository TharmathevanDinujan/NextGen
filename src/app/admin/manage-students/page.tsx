"use client";

import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Header from "../../../../components/AdminHeader"; // import your header component

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

interface Student {
  fullname: string;
  studentId: string;
  email: string;
  phone?: string;
  gender?: string;
  profilePicUrl?: string;
  id?: string;
}

interface Course {
  courseName: string;
  instructor?: string;
  location?: string;
  duration?: string;
  courseFee?: string | number;
  imageUrl?: string;
  id?: string;
}

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesModalOpen, setCoursesModalOpen] = useState(false);
  const [currentCourses, setCurrentCourses] = useState<Course[]>([]);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [currentRemoveId, setCurrentRemoveId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [removing, setRemoving] = useState(false);
  const [viewLoading, setViewLoading] = useState<string | null>(null);

  // Load students
  useEffect(() => {
    const unsubscribe = db.collection("students").onSnapshot((snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((doc) => list.push({ ...(doc.data() as Student), id: doc.id }));
      setStudents(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // View enrolled courses
  const viewCourses = async (studentId: string) => {
    setViewLoading(studentId);
    try {
      const snapshot = await db.collection("students").doc(studentId).collection("myCourses").get();
      if (snapshot.empty) {
        setCurrentCourses([]);
      } else {
        const coursesList: Course[] = [];
        for (const doc of snapshot.docs) {
          const courseId = doc.data().courseId;
          const courseDoc = await db.collection("courses").doc(courseId).get();
          if (courseDoc.exists) {
            coursesList.push({ id: courseDoc.id, ...courseDoc.data() } as Course);
          }
        }
        setCurrentCourses(coursesList);
      }
      setCoursesModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch courses.");
    } finally {
      setViewLoading(null);
    }
  };

  const confirmRemoveStudent = (studentId: string) => {
    setCurrentRemoveId(studentId);
    setRemoveModalOpen(true);
  };

  const handleRemoveStudent = async () => {
    if (!currentRemoveId) return;
    setRemoving(true);
    try {
      await db.collection("students").doc(currentRemoveId).delete();
      setSuccessMessage("Student removed successfully!");
      setRemoveModalOpen(false);
      setCurrentRemoveId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setRemoveModalOpen(false);
      setCurrentRemoveId(null);
      alert("Failed to remove student.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Students</h1>

        {loading ? (
          // Skeleton loader
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col items-start animate-pulse"
              >
                <div className="w-20 h-20 rounded-full bg-gray-300 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex gap-2 w-full">
                  <div className="h-8 bg-gray-300 rounded flex-1"></div>
                  <div className="h-8 bg-gray-300 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col items-start transition transform hover:-translate-y-1 hover:shadow-lg w-full"
              >
                <img
                  src={student.profilePicUrl || "/images/default-user.png"}
                  alt={student.fullname}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-800">{student.fullname}</h3>
                <p className="text-gray-500 text-sm">Email: {student.email}</p>
                <p className="text-gray-500 text-sm">
                  ID: {student.studentId} | Phone: {student.phone || "-"} | Gender: {student.gender || "-"}
                </p>
                <div className="flex gap-2 mt-3 w-full">
                  <button
                    onClick={() => viewCourses(student.id!)}
                    className="flex-1 bg-[#009688] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#00796b] transition transform hover:scale-105 flex justify-center items-center gap-2"
                  >
                    {viewLoading === student.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "View Courses"
                    )}
                  </button>
                  <button
                    onClick={() => confirmRemoveStudent(student.id!)}
                    className="flex-1 bg-red-500 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-600 transition transform hover:scale-105 flex justify-center items-center"
                  >
                    {removing && currentRemoveId === student.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Remove"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Courses Modal */}
      {coursesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCoursesModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl w-full max-w-3xl p-6 m-4 z-10 overflow-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Enrolled Courses</h2>
            {currentCourses.length === 0 ? (
              <p className="text-center text-gray-600">No enrolled courses.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCourses.map((course) => (
                  <div key={course.id} className="bg-gray-100 p-4 rounded-lg flex gap-4 items-start">
                    <img
                      src={course.imageUrl || "/images/default-course.jpg"}
                      alt={course.courseName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{course.courseName}</h3>
                      <p className="text-gray-600 text-sm">Instructor: {course.instructor || "-"}</p>
                      <p className="text-gray-600 text-sm">Location: {course.location || "-"}</p>
                      <p className="text-gray-600 text-sm">Duration: {course.duration || "-"}</p>
                      <p className="text-gray-600 text-sm">Fee: LKR {course.courseFee || "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setCoursesModalOpen(false)}
              className="mt-4 w-full bg-[#009688] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#00796b] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {removeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setRemoveModalOpen(false)}
          ></div>
          <div className="relative bg-[#004d40] text-white rounded-xl w-full max-w-md p-6 m-4 z-10">
            <h3 className="text-xl font-bold mb-4 text-center">⚠️ Remove Student?</h3>
            <p className="text-center mb-4">
              Do you really want to remove this student? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleRemoveStudent}
                className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition transform hover:scale-105 flex justify-center items-center"
              >
                {removing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Yes, Remove"
                )}
              </button>
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="bg-gray-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down">
          {successMessage}
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
