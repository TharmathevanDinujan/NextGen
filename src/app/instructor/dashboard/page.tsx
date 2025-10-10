"use client";

import Sidebar from "../../../../components/InstructerHeader";

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6">
        {/* Header */}
        <header className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Instructor</h1>
          <p className="text-gray-600">Manage your courses, sessions, and students efficiently</p>
        </header>

        {/* Top Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-700">My Courses</h3>
            <p className="text-xl text-[#000] font-bold mt-2">5</p>
            <span className="text-green-600 font-medium text-sm">+1 Since Last Month</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-700">Upcoming Sessions</h3>
            <p className="text-xl font-bold text-[#000]  mt-2">3</p>
            <span className="text-green-600 font-medium text-sm">Next 7 Days</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-700">Enrolled Students</h3>
            <p className="text-xl font-bold text-[#000]  mt-2">78</p>
            <span className="text-green-600 font-medium text-sm">+5% This Month</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-700">Pending Enquiries</h3>
            <p className="text-xl font-bold text-[#000]  mt-2">12</p>
            <span className="text-red-600 font-medium text-sm">-2% Since Last Week</span>
          </div>
        </section>

        {/* Upcoming Sessions Table */}
        <section className="bg-white p-6 rounded-lg shadow mb-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-700 mb-4">Upcoming Sessions</h3>
          <table className="w-full border-collapse">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Batch</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Venue/Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b text-[#000] ">
                <td className="p-3">ICT Fundamentals</td>
                <td className="p-3">Batch A</td>
                <td className="p-3">05 Oct 2025</td>
                <td className="p-3">10:00 AM - 1:00 PM</td>
                <td className="p-3">Colombo / On-site</td>
              </tr>
              <tr className="border-b text-[#000] ">
                <td className="p-3">Plumbing Basics</td>
                <td className="p-3">Batch B</td>
                <td className="p-3">06 Oct 2025</td>
                <td className="p-3">2:00 PM - 5:00 PM</td>
                <td className="p-3">Kandy / On-site</td>
              </tr>
              <tr className="border-b text-[#000] ">
                <td className="p-3">Hotel Management</td>
                <td className="p-3">Batch C</td>
                <td className="p-3">08 Oct 2025</td>
                <td className="p-3">9:00 AM - 12:00 PM</td>
                <td className="p-3">Online</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Announcements */}
        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Announcements</h3>
          <ul className="list-disc list-inside text-[#000]  space-y-2">
            <li>New batch for ICT Fundamentals starts on 05 Oct 2025.</li>
            <li>Submit your course reports by 10 Oct 2025.</li>
            <li>Upcoming faculty meeting on 07 Oct 2025 at 4:00 PM.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
