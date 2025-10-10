"use client";

import React, { useState } from "react";
import Header from "../../../../components/StudentHeader";

interface ClassDetail {
  name: string;
  lecturer: string;
  room: string;
  notes: string;
}

interface ScheduleRow {
  time: string;
  monday?: ClassDetail;
  tuesday?: ClassDetail;
  wednesday?: ClassDetail;
  thursday?: ClassDetail;
  friday?: ClassDetail;
}

interface Material {
  id: number;
  name: string;
  size: string;
  uploaded: string;
}

const schedule: ScheduleRow[] = [
  {
    time: "10:00 AM",
    monday: { name: "Java CS101", lecturer: "Mr.Dinujan", room: "R101", notes: "Intro to Java" },
    wednesday: { name: "Java CS101", lecturer: "Mr.Sulojan", room: "R101", notes: "Lecture 2" },
    friday: { name: "Web WD202", lecturer: "Mr.Sanjeevan", room: "R202", notes: "HTML Basics" },
  },
  {
    time: "11:00 AM",
    monday: { name: "Python PY101", lecturer: "Mrs.Thadshika", room: "R103", notes: "Variables & Loops" },
    wednesday: { name: "Python PY101", lecturer: "Mrs.Niththila", room: "R103", notes: "Functions" },
    friday: { name: "AI AI101", lecturer: "Mrs.Thilakshana", room: "R305", notes: "Intro AI" },
  },
  {
    time: "12:00 PM",
    tuesday: { name: "DB Sys DB303", lecturer: "Mr.Nilanthan", room: "R201", notes: "ER Diagrams" },
    thursday: { name: "DB Sys DB303", lecturer: "Mrs.Kaavya", room: "R201", notes: "Normalization" },
  },
  {
    time: "1:00 PM",
    monday: { name: "Web WD202", lecturer: "Mr.Nivethan", room: "R202", notes: "CSS Basics" },
    wednesday: { name: "Web WD202", lecturer: "Mrs.sulojana", room: "R202", notes: "Flexbox" },
    friday: { name: "Java CS101", lecturer: "Mr.Dinujan", room: "R101", notes: "OOP Concepts" },
  },
  // Add more rows as needed (you can repeat dummy data for demo)
];

const materials: Material[] = [
  { id: 1, name: "Java Lecture 1.pdf", size: "2MB", uploaded: "2025-09-01" },
  { id: 2, name: "Python Basics.pptx", size: "3.5MB", uploaded: "2025-09-03" },
  { id: 3, name: "DB Systems Notes.docx", size: "1.2MB", uploaded: "2025-09-05" },
  { id: 4, name: "Web Development Tutorial.pdf", size: "4MB", uploaded: "2025-09-06" },
  { id: 5, name: "AI Introduction.pdf", size: "2.5MB", uploaded: "2025-09-07" },
  { id: 6, name: "Python Project.zip", size: "5MB", uploaded: "2025-09-08" },
  { id: 7, name: "Java Assignments.docx", size: "1.8MB", uploaded: "2025-09-09" },
  { id: 8, name: "Web WD Lab Exercises.pdf", size: "2.3MB", uploaded: "2025-09-10" },
  { id: 9, name: "AI Lab Notes.docx", size: "2MB", uploaded: "2025-09-11" },
  { id: 10, name: "DB Sys Final.pdf", size: "3MB", uploaded: "2025-09-12" },
];

export default function ScheduleMaterials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderClassCell = (classDetail?: ClassDetail) => {
    return classDetail ? (
      <div className="bg-teal-500 text-white rounded-md px-2 py-1">
        {classDetail.name}
      </div>
    ) : (
      "-"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Header />

      <main className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8">
        {/* Schedule Table */}
        <div className="flex-1 overflow-x-auto bg-white rounded-xl shadow-md p-4 animate-slideInLeft">
          <h1 className="text-2xl font-bold text-teal-800 mb-4">Schedule</h1>
          <table className="min-w-full border-collapse text-center">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="p-3">Time</th>
                <th className="p-3">Monday</th>
                <th className="p-3">Tuesday</th>
                <th className="p-3">Wednesday</th>
                <th className="p-3">Thursday</th>
                <th className="p-3">Friday</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, index) => {
                const isExpanded = expandedRows.includes(index);
                return (
                  <React.Fragment key={index}>
                    <tr
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? "bg-teal-100 text-teal-900" : ""
                      }`}
                      onClick={() => toggleRow(index)}
                    >
                      <td className="border px-3 py-2">{row.time}</td>
                      <td className="border px-3 py-2">{renderClassCell(row.monday)}</td>
                      <td className="border px-3 py-2">{renderClassCell(row.tuesday)}</td>
                      <td className="border px-3 py-2">{renderClassCell(row.wednesday)}</td>
                      <td className="border px-3 py-2">{renderClassCell(row.thursday)}</td>
                      <td className="border px-3 py-2">{renderClassCell(row.friday)}</td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-3 text-left text-gray-700 bg-gray-50 animate-fadeIn">
                          {["monday", "tuesday", "wednesday", "thursday", "friday"].map((day, i) => {
                            const detail = row[day as keyof ScheduleRow] as ClassDetail | undefined;
                            return detail ? (
                              <div key={i} className="mb-2">
                                <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {" "}
                                {detail.name} | Lecturer: {detail.lecturer} | Room: {detail.room} | Notes: {detail.notes}
                              </div>
                            ) : null;
                          })}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Course Materials */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-md animate-slideInRight">
          <h2 className="text-2xl font-bold text-teal-800 mb-4">Course Materials</h2>
          <input
            type="text"
            placeholder="Search material..."
            className="w-full p-3 rounded-lg border text-[#000] border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
            {filteredMaterials.map((m) => (
              <div
                key={m.id}
                className="p-3 bg-teal-100 text-[#000] rounded-lg hover:bg-teal-200 transition transform hover:scale-105"
              >
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-teal-900 mt-1">
                  Size: {m.size} | Uploaded: {m.uploaded}
                </div>
              </div>
            ))}
            {filteredMaterials.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No materials found.</p>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease forwards; }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.8s ease forwards; }
      `}</style>
    </div>
  );
}
