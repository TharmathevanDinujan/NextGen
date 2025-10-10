"use client";

import { useEffect, useState } from "react";
import VisitorHeader from "../../../../components/VisitorHeader";
import Image from "next/image";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2wwTdPSgNjcyoxjPDU_00ceGaU882XC8",
  authDomain: "nextgen-9de89.firebaseapp.com",
  projectId: "nextgen-9de89",
  storageBucket: "nextgen-9de89.firebasestorage.app",
  messagingSenderId: "446092918649",
  appId: "1:446092918649:web:4c83d7349c62e33cb279a8",
};

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // use the already initialized app
}

const db = firebase.firestore();

interface Course {
  id: string;
  courseName: string;
  category: string;
  location: string;
  duration: string;
  instructor: string;
  courseFee: string;
  university: string;
  imageUrl: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [instructor, setInstructor] = useState("");

  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
  const [rotation, setRotation] = useState<{ [key: string]: { x: number; y: number } }>({});

  const [loading, setLoading] = useState(true);

  const toggleFlip = (id: string) => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  useEffect(() => {
    setLoading(true);
    db.collection("courses")
      .get()
      .then((snapshot) => {
        const data: Course[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Course));
        setCourses(data);
        setFilteredCourses(data);

        const initialRotation: { [key: string]: { x: number; y: number } } = {};
        data.forEach((c) => (initialRotation[c.id] = { x: 0, y: 0 }));
        setRotation(initialRotation);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = courses.filter((c) => {
      return (
        (c.courseName.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase())) &&
        (category === "" || c.category === category) &&
        (location === "" || c.location === location) &&
        (duration === "" || c.duration === duration) &&
        (instructor === "" || c.instructor.toLowerCase().includes(instructor.toLowerCase()))
      );
    });
    setFilteredCourses(filtered);
  }, [search, category, location, duration, instructor, courses]);

  const uniqueCategories = Array.from(new Set(courses.map((c) => c.category)));
  const uniqueLocations = Array.from(new Set(courses.map((c) => c.location)));
  const uniqueDurations = Array.from(new Set(courses.map((c) => c.duration)));

  return (
    <div className="bg-gray-50 min-h-screen">
      <VisitorHeader />

      <main className="container mx-auto px-4 py-10 font-poppins">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#004d40]">
          Our Professional Courses
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-[#004d40] p-4 rounded-xl shadow-md text-white">
          <input
            type="text"
            placeholder="Search by course name..."
            className="flex-1 min-w-[150px] px-3 py-2 rounded-md text-white placeholder-white focus:outline-none bg-[#00695c]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 rounded-md text-white focus:outline-none bg-[#00695c]"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 rounded-md text-white focus:outline-none bg-[#00695c]"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 rounded-md text-white focus:outline-none bg-[#00695c]"
          >
            <option value="">All Durations</option>
            {uniqueDurations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Instructor name"
            className="flex-1 min-w-[150px] px-3 py-2 rounded-md text-white placeholder-white focus:outline-none bg-[#00695c]"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-64 rounded-2xl bg-gray-200 animate-pulse"
              >
                <div className="w-full h-40 bg-gray-300 rounded-t-2xl"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-1 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Courses Grid
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.length === 0 && (
              <p className="col-span-full text-center text-gray-600">No courses found.</p>
            )}

            {filteredCourses.map((course) => {
              const isFlipped = flippedCards[course.id] || false;

              const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                if (/Mobi|Android/i.test(navigator.userAgent)) return;

                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateY = ((x / rect.width) - 0.5) * 15;
                const rotateX = (0.5 - y / rect.height) * 15;

                setRotation((prev) => ({ ...prev, [course.id]: { x: rotateX, y: rotateY } }));
                setFlippedCards((prev) => ({ ...prev, [course.id]: true }));
              };

              const handleMouseLeave = () => {
                setRotation((prev) => ({ ...prev, [course.id]: { x: 0, y: 0 } }));
                setFlippedCards((prev) => ({ ...prev, [course.id]: false }));
              };

              return (
                <div
                  key={course.id}
                  className="perspective relative w-full h-65 cursor-pointer"
                  onClick={() => toggleFlip(course.id)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="relative w-full h-64 rounded-2xl shadow-lg transition-transform duration-700 [transform-style:preserve-3d] hover:shadow-2xl"
                    style={{
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : `rotateX(${rotation[course.id]?.x || 0}deg) rotateY(${rotation[course.id]?.y || 0}deg)`,
                    }}
                  >
                    {/* Front */}
                    <div className="absolute w-full h-64 rounded-2xl [backface-visibility:hidden] bg-white flex flex-col items-center p-3 overflow-hidden">
                      <Image
                        src={course.imageUrl}
                        alt={course.courseName}
                        width={500}
                        height={200}
                        className="w-full h-43 object-cover rounded-lg shadow-sm transition-transform duration-500 hover:scale-105"
                      />
                      <h3 className="text-lg font-semibold mt-3 text-[#004d40]">
                        {course.courseName}
                      </h3>
                      <p className="text-sm text-gray-500">{course.category}</p>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#004d40] text-white flex flex-col justify-center items-start p-6 gap-2">
                      <h3 className="text-lg font-bold text-[#e0f2f1]">{course.courseName}</h3>
                      <p><strong>Instructor:</strong> {course.instructor}</p>
                      <p><strong>Duration:</strong> {course.duration}</p>
                      <p><strong>Location:</strong> {course.location}</p>
                      <p><strong>Fee:</strong> LKR {course.courseFee}</p>
                      <p><strong>University:</strong> {course.university}</p>
                      <a
                        href={`/auth/register?course=${course.id}`}
                        className="mt-3 px-4 py-2 bg-[#009688] rounded-lg font-semibold text-white hover:bg-[#00796b] transition-all"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-[#004d40] text-white text-center py-3 mt-10">
        &copy; 2025 NextGen Institute. All rights reserved.
      </footer>
    </div>
  );
}
