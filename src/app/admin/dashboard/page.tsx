"use client";
import AdminHeader from "../../../../components/AdminHeader";
import { useEffect } from "react";
import Chart from "chart.js/auto";

export default function AdminDashboard() {
  useEffect(() => {
    // Helper function to destroy chart if it exists
    const createChart = (ctx: HTMLCanvasElement, config: any) => {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) existingChart.destroy();
      return new Chart(ctx, config);
    };

    // Doughnut chart
    const sessionsCtx = document.getElementById("sessionsChart") as HTMLCanvasElement;
    createChart(sessionsCtx, {
      type: "doughnut",
      data: {
        labels: ["Jaffna", "Colombo", "Kandy"],
        datasets: [
          {
            label: "Enrollments",
            data: [500, 400, 345],
            backgroundColor: ["#00796B", "#00BFA5", "#009688"],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });

    // Line chart
    const salesCtx = document.getElementById("salesChart") as HTMLCanvasElement;
    createChart(salesCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          { label: "ICT", data: [50, 65, 70, 80, 75, 90, 100], borderColor: "#e91e63", backgroundColor: "rgba(233,30,99,0.1)", tension: 0.3 },
          { label: "Hospitality", data: [30, 40, 35, 50, 45, 55, 60], borderColor: "#3f51b5", backgroundColor: "rgba(63,81,181,0.1)", tension: 0.3 },
          { label: "Engineering", data: [20, 25, 30, 35, 32, 40, 42], borderColor: "#ff9800", backgroundColor: "rgba(255,152,0,0.1)", tension: 0.3 },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });

    // Bar chart
    const deviceCtx = document.getElementById("deviceChart") as HTMLCanvasElement;
    createChart(deviceCtx, {
      type: "bar",
      data: {
        labels: ["Website", "Mobile App", "Desktop App"],
        datasets: [
          { label: "Active Users", data: [168, 200, 95], backgroundColor: ["#4caf50", "#2196f3", "#f44336"] },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  }, []);

  return (
    <div className="flex">
      <AdminHeader />
      <main className="flex-grow ml-0 md:ml-64 p-4 bg-gray-100 min-h-screen">
        {/* Header */}
        <header className="bg-white rounded-lg shadow p-6 mt-20 mb-6 md:mb-6 md:mt-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, Admin</h1>
          <p className="text-gray-600">Monitor courses, students, instructors, and events at SkillPro Institute</p>
        </header>

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"> 
            <h3 className="font-semibold text-gray-700">Total Students</h3>
            <p className="text-2xl  text-[#000] font-bold">1,245</p>
            <span className="text-green-500 font-medium">+5% Since Last Week</span>
          </div>
          <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"> 
            <h3 className="font-semibold text-gray-700">Active Courses</h3>
            <p className="text-2xl text-[#000] font-bold">78</p>
            <span className="text-green-500 font-medium">+2% This Month</span>
          </div>
          <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"> 
            <h3 className="font-semibold text-gray-700">New Enquiries</h3>
            <p className="text-2xl text-[#000] font-bold">32</p>
            <span className="text-red-500 font-medium">-1% This Week</span>
          </div>
          <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"> 
            <h3 className="font-semibold text-gray-700">Revenue</h3>
            <p className="text-2xl text-[#000] font-bold">LKR 287,493</p>
            <span className="text-green-500 font-medium">+1.4% Since Last Month</span>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-[#000] mb-2">Student Enrollment by Branch</h3>
            <canvas id="sessionsChart"></canvas>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-[#000] mb-2">Course Completion Analytics</h3>
            <canvas id="salesChart"></canvas>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-[#000] mb-2">Device & System Usage</h3>
            <canvas id="deviceChart"></canvas>
          </div>
        </section>
      </main>
    </div>
  );
}
