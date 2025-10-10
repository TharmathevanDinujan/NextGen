"use client";

import { useState } from "react";
import Sidebar from "../../../../components/InstructerHeader"; // Import Sidebar component

export default function UploadMaterials() {
  const [search, setSearch] = useState("");

  const materials = [
    { name: "Java Lecture 1.pdf", type: "PDF", size: "2MB", date: "2025-09-01" },
    { name: "Python Basics.pptx", type: "PPTX", size: "3.5MB", date: "2025-09-03" },
    { name: "DB Systems Notes.docx", type: "DOCX", size: "1.2MB", date: "2025-09-05" },
    { name: "Web Development Tutorial.pdf", type: "PDF", size: "4MB", date: "2025-09-06" },
    { name: "AI Introduction.pdf", type: "PDF", size: "2.5MB", date: "2025-09-07" },
    { name: "Python Project.zip", type: "ZIP", size: "5MB", date: "2025-09-08" },
    { name: "Java Assignments.docx", type: "DOCX", size: "1.8MB", date: "2025-09-09" },
    { name: "Web WD Lab Exercises.pdf", type: "PDF", size: "2.3MB", date: "2025-09-10" },
    { name: "AI Lab Notes.docx", type: "DOCX", size: "2MB", date: "2025-09-11" },
    { name: "DB Sys Final.pdf", type: "PDF", size: "3MB", date: "2025-09-12" },
  ];

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 flex flex-col gap-6">
        {/* Upload Panel */}
        <section className="bg-white p-5 rounded-lg shadow-md">
          <header className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
              Upload Materials
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Add new lectures, notes, and resources for your students.
            </p>
          </header>
          <form className="flex flex-col gap-4 text-[#000] ">
            <div className="flex flex-col">
              <label htmlFor="course-select" className="font-semibold mb-1">Select Course:</label>
              <select id="course-select" name="course" className="p-2 rounded border border-gray-300">
                <option value="WD202">Web Development</option>
                <option value="DB303">Database Systems</option>
                <option value="CS101">Java Programming</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="material-type" className="font-semibold mb-1">Material Type:</label>
              <select id="material-type" name="type" className="p-2 rounded border border-gray-300">
                <option>Lecture Slides</option>
                <option>Reading Assignment</option>
                <option>Code Examples</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="material-file" className="font-semibold mb-1">Upload File:</label>
              <input type="file" id="material-file" name="file" required className="p-2 border border-gray-300 rounded"/>
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="font-semibold mb-1">Description:</label>
              <textarea
                id="description"
                name="description"
                placeholder="Briefly describe the content..."
                className="p-2 border border-gray-300 rounded resize-none min-h-[80px]"
              />
            </div>
            <button type="submit" className="bg-green-900 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-all">
              Upload & Publish
            </button>
          </form>
        </section>

        {/* View Materials Panel */}
        <section className="bg-white p-5 rounded-lg shadow-md flex flex-col gap-4">
          <header className="mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
              Uploaded Materials
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Search and view existing materials.
            </p>
          </header>
          <input
            type="text"
            placeholder="Search material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border border-gray-300 w-full mb-4"
          />
          <div className="flex flex-col gap-3">
            {filteredMaterials.map((material, index) => (
              <div
                key={index}
                className="p-3 bg-teal-100 rounded-lg text-teal-900 font-semibold cursor-pointer hover:bg-teal-200 transition-all"
              >
                <div className="text-sm md:text-base">{material.name}</div>
                <div className="text-xs md:text-sm text-teal-800 mt-1">
                  Type: {material.type} | Size: {material.size} | Uploaded: {material.date}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
