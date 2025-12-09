"use client";

import React from "react";
import Header from "../../../../components/StudentHeader"; // Import your header component

interface Assignment {
  id: number;
  title: string;
  course: string;
  status: "due" | "graded" | "upcoming";
  dueDate?: string;
  grade?: string;
  daysLeft?: number;
}

const assignments: Assignment[] = [
  { id: 1, title: "Web Dev Project Phase 1", course: "Web Development", status: "due", dueDate: "2025-10-05", daysLeft: 5 },
  { id: 2, title: "Java Fundamentals Quiz", course: "Java Programming", status: "graded", grade: "A- (92/100)" },
  { id: 3, title: "Database Design Report", course: "Database Systems", status: "upcoming", dueDate: "2025-10-15", daysLeft: 15 },
  { id: 4, title: "Python Mini Project", course: "Python Programming", status: "graded", grade: "B+ (85/100)" },
  { id: 5, title: "UI/UX Wireframe Design", course: "Human-Computer Interaction", status: "due", dueDate: "2025-10-07", daysLeft: 7 },
  { id: 6, title: "Operating Systems Quiz", course: "Operating Systems", status: "graded", grade: "A (96/100)" },
  { id: 7, title: "Networking Lab Report", course: "Computer Networks", status: "upcoming", dueDate: "2025-10-20", daysLeft: 20 },
];

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header Component */}
      <Header />

      <main className="pt-20 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Assignments</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {assignments.map((a, index) => (
            <div
              key={a.id}
              className={`relative bg-white p-5 rounded-xl shadow-lg overflow-hidden transform translate-y-8 opacity-0 animate-fadeUp`}
              style={{ animationDelay: `${0.1 * (index + 1)}s`, animationFillMode: "forwards" }}
            >
              {/* Gradient overlay */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-10 -rotate-12"></div>

              <h2 className="text-teal-700 text-lg sm:text-xl font-semibold mb-2 relative z-10">{a.title}</h2>
              <p className="mb-2 relative text-[#000] z-10">Course: {a.course}</p>

              {a.status === "due" && a.dueDate && a.daysLeft !== undefined && (
                <p className="mb-3 relative text-[#000] z-10">Due: {a.dueDate} ({a.daysLeft} days left)</p>
              )}
              {a.status === "graded" && a.grade && (
                <p className="mb-3 relative text-[#000] z-10">Grade: {a.grade}</p>
              )}
              {a.status === "upcoming" && a.dueDate && a.daysLeft !== undefined && (
                <p className="mb-3 relative text-[#000] z-10">Due: {a.dueDate} ({a.daysLeft} days left)</p>
              )}

              <button
                className={`relative z-10 px-4 py-2 rounded-lg font-semibold text-white transition transform hover:scale-105 ${
                  a.status === "graded"
                    ? "bg-green-800 hover:bg-green-700"
                    : a.status === "due"
                    ? "bg-orange-800 hover:bg-orange-600"
                    : "bg-blue-800 hover:bg-blue-700"
                }`}
              >
                {a.status === "graded" ? "View Feedback" : "Submit"}
              </button>

              {/* Left border color based on status */}
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${
                  a.status === "due"
                    ? "bg-orange-500"
                    : a.status === "graded"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
              ></span>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeUp {
          animation: fadeUp 0.7s forwards;
        }
      `}</style>
    </div>
  );
}
