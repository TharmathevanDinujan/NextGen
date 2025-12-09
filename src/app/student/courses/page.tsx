"use client";

import { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import Header from "../../../../components/StudentHeader";
import { getSession } from "@/lib/auth";

interface Course {
  id: string;
  courseName: string;
  instructor: string;
  location: string;
  duration: string;
  courseFee: number;
  category?: string;
  imageUrl?: string;
  awardingUniversity?: string;
}

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [studentName, setStudentName] = useState("Student");
  const [studentDocId, setStudentDocId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    duration: "",
    instructor: "",
  });
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingRegister, setLoadingRegister] = useState<string | null>(null);
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  const dragStartX = useRef<number | null>(null);

  // Update windowHeight on resize
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyA2wwTdPSgNjcyoxjPDU_00ceGaU882XC8",
      authDomain: "nextgen-9de89.firebaseapp.com",
      projectId: "nextgen-9de89",
      storageBucket: "nextgen-9de89.firebasestorage.app",
      messagingSenderId: "446092918649",
      appId: "1:446092918649:web:4c83d7349c62e33cb279a8"
    
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Use session system instead of old localStorage
    const session = getSession("student");
    
    if (!session) {
      alert("You are not logged in!");
      window.location.href = "/auth/login";
      return;
    }
    
    const loggedEmail = session.email;
    const loggedName = session.name;
    setStudentName(loggedName || loggedEmail);
    
    // Also set old localStorage items for backward compatibility with other parts
    localStorage.setItem("loggedStudentEmail", loggedEmail);
    localStorage.setItem("loggedStudentName", loggedName);

    const loadStudent = async () => {
      const snapshot = await db
        .collection("students")
        .where("email", "==", loggedEmail)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setStudentDocId(doc.id);
        const fullname = doc.data().fullname;
        if (fullname) setStudentName(fullname);
      }
    };

    const loadCourses = async () => {
      setLoadingCourses(true);
      const snapshot = await db.collection("courses").get();
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Course)
      );
      setCourses(data);
      setFilteredCourses(data);
      loadMyCourses(data);
      setLoadingCourses(false);
    };

    const loadMyCourses = async (allCourses: Course[]) => {
      if (!studentDocId) return;
      const snapshot = await db
        .collection("students")
        .doc(studentDocId)
        .collection("myCourses")
        .get();
      const registered = snapshot.docs
        .map((d) => allCourses.find((c) => c.id === d.data().courseId))
        .filter(Boolean) as Course[];
      setMyCourses(registered);
    };

    loadStudent().then(loadCourses);
  }, [studentDocId]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let temp = [...courses];
    if (newFilters.search)
      temp = temp.filter(
        (c) =>
          c.courseName.toLowerCase().includes(newFilters.search.toLowerCase()) ||
          c.category?.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    if (newFilters.category) temp = temp.filter((c) => c.category === newFilters.category);
    if (newFilters.location) temp = temp.filter((c) => c.location === newFilters.location);
    if (newFilters.duration) temp = temp.filter((c) => c.duration === newFilters.duration);
    if (newFilters.instructor)
      temp = temp.filter((c) =>
        c.instructor.toLowerCase().includes(newFilters.instructor.toLowerCase())
      );

    setFilteredCourses(temp);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      duration: "",
      instructor: "",
    });
    setFilteredCourses(courses);
  };

  const registerCourse = async (courseId: string) => {
    if (!studentDocId) return;
    setLoadingRegister(courseId);
    const db = firebase.firestore();
    const myCoursesRef = db
      .collection("students")
      .doc(studentDocId)
      .collection("myCourses")
      .doc(courseId);
    const doc = await myCoursesRef.get();
    if (doc.exists) {
      setModalMessage(`${studentName}, you have already registered this course!`);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2500);
      setLoadingRegister(null);
      return;
    }
    await myCoursesRef.set({
      courseId,
      registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    const course = courses.find((c) => c.id === courseId);
    if (course) setMyCourses((prev) => [...prev, course]);
    setModalMessage(`${studentName}, registered successfully!`);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2500);
    setLoadingRegister(null);
  };

  // ---------------- Fixed TypeScript issue with optional fields ----------------
  const categories: string[] = Array.from(
    new Set(courses.map((c) => c.category).filter((c): c is string => !!c))
  );
  const locations: string[] = Array.from(
    new Set(courses.map((c) => c.location).filter((l): l is string => !!l))
  );
  const durations: string[] = Array.from(
    new Set(courses.map((c) => c.duration).filter((d): d is string => !!d))
  );

  // Swipe handlers
  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };
  const handleSwipeMove = (e: React.TouchEvent | React.MouseEvent, courseId: string) => {
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    if (dragStartX.current !== null) {
      const delta = currentX - dragStartX.current;
      if (Math.abs(delta) > 50) {
        setFlippedCard(flippedCard === courseId ? null : courseId);
        dragStartX.current = null;
      }
    }
  };
  const handleSwipeEnd = () => {
    dragStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="p-4 md:p-8">
        <h1 className="text-2xl text-[#000] font-bold mb-6">
          Welcome <span className="text-teal-700">{studentName}</span>, Explore Courses
        </h1>

        {/* ---------------- Modern Filter Section ---------------- */}
        <div className="bg-gradient-to-r from-teal-700 via-cyan-600 to-teal-800 p-4 rounded-xl shadow-lg mb-8 flex flex-col items-center">
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            Filter Courses
          </h2>
          <div className="flex flex-wrap gap-3 items-center justify-center w-full">
            <input
              type="text"
              name="search"
              placeholder="Search by name or category"
              value={filters.search}
              onChange={handleFilterChange}
              className="p-2 rounded-lg text-gray-900 bg-white w-full sm:w-[18%] focus:ring-2 focus:ring-cyan-400 outline-none"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-2 rounded-lg text-gray-900 bg-white w-full sm:w-[18%] focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="p-2 rounded-lg text-gray-900 bg-white w-full sm:w-[18%] focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              name="duration"
              value={filters.duration}
              onChange={handleFilterChange}
              className="p-2 rounded-lg text-gray-900 bg-white w-full sm:w-[18%] focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="">All Durations</option>
              {durations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="text"
              name="instructor"
              placeholder="Instructor name"
              value={filters.instructor}
              onChange={handleFilterChange}
              className="p-2 rounded-lg text-gray-900 bg-white w-full sm:w-[18%] focus:ring-2 focus:ring-cyan-400 outline-none"
            />
            <div className="flex gap-2 w-full sm:w-auto justify-center mt-3 sm:mt-0">
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Clear
              </button>
              <button
                onClick={() => setShowSidebar(true)}
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                My Courses
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Courses Grid ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-3 lg:gap-x-0 gap-y-10 md:gap-y-6 place-items-center">
          {loadingCourses
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[90%] sm:w-[80%] md:w-[90%] lg:w-[85%] h-64 bg-white rounded-lg shadow-md animate-pulse flex flex-col"
                >
                  <div className="h-40 bg-gray-300 w-full rounded-t-lg"></div>
                  <div className="p-3 flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                    <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
                  </div>
                </div>
              ))
            : filteredCourses.length === 0 && (
                <p className="col-span-full text-center text-gray-600">
                  No courses found.
                </p>
              )}

          {!loadingCourses &&
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="relative w-[90%] sm:w-[80%] md:w-[90%] lg:w-[85%] h-64 sm:h-72 md:h-64 lg:h-60 cursor-pointer"
                style={{ perspective: "1000px" }}
                onMouseDown={handleSwipeStart}
                onMouseMove={(e) => handleSwipeMove(e, course.id)}
                onMouseUp={handleSwipeEnd}
                onMouseLeave={handleSwipeEnd}
                onTouchStart={handleSwipeStart}
                onTouchMove={(e) => handleSwipeMove(e, course.id)}
                onTouchEnd={handleSwipeEnd}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      flippedCard === course.id
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute w-full h-full rounded-lg overflow-hidden bg-white shadow-lg flex flex-col items-center justify-start"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={course.imageUrl || "/images/default-course.jpg"}
                      alt={course.courseName}
                      className="w-full h-40 sm:h-44 md:h-40 object-cover"
                    />
                    <h3 className="mt-2 text-teal-700 font-semibold text-lg text-center px-2 leading-tight">
                      {course.courseName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 animate-pulse">
                      Swipe to see details →
                    </p>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute w-full h-full rounded-lg p-4 bg-gradient-to-br from-white via-white to-white text-black flex flex-col justify-start shadow-lg"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-1">
                      {course.courseName}
                    </h3>
                    <p>
                      <strong>Instructor:</strong> {course.instructor}
                    </p>
                    <p>
                      <strong>Location:</strong> {course.location}
                    </p>
                    <p>
                      <strong>Duration:</strong> {course.duration}
                    </p>
                    <p>
                      <strong>Fee:</strong> LKR {course.courseFee}
                    </p>
                    <p>
                      <strong>Awarding University:</strong>{" "}
                      {course.awardingUniversity || "N/A"}
                    </p>
                    <button
                      onClick={() => registerCourse(course.id)}
                      disabled={loadingRegister === course.id}
                      className="mt-3 bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-500 p-2 rounded-md font-semibold text-white hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                      {loadingRegister === course.id ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            ></path>
                          </svg>
                          Registering...
                        </>
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* My Courses Sidebar */}
      <div
        className={`fixed top-0 right-0 bg-white shadow-lg transform transition-transform z-50`}
        style={{
          width: "22rem",
          height:
            windowHeight > 0 && myCourses.length * 80 + 100 > windowHeight
              ? "90%"
              : "auto",
          transform: showSidebar ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold text-[#000] mb-4">My Courses</h2>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[80vh]">
            {myCourses.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-2 bg-teal-100 rounded-md"
              >
                <img
                  src={c.imageUrl || "/images/default-course.jpg"}
                  alt={c.courseName}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h4 className="text-teal-700 font-semibold">{c.courseName}</h4>
                  <p className="text-gray-600 text-sm">
                    {c.instructor} • {c.location}
                  </p>
                </div>
              </div>
            ))}
            {myCourses.length === 0 && (
              <p className="text-center text-gray-600">No courses yet</p>
            )}
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="mt-4 w-full bg-orange-500 hover:bg-pink-500 p-2 rounded-md font-semibold"
          >
            Close
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative text-[#000] bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
