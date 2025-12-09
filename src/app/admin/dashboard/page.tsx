"use client";
import AdminHeader from "../../../../components/AdminHeader";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

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

interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  newEnquiries: number;
  totalRevenue: number;
  branchEnrollments: { [key: string]: number };
  courseEnrollments: { [key: string]: number };
  categoryDistribution: { [key: string]: number };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalStudents: 0,
    totalCourses: 0,
    totalInstructors: 0,
    newEnquiries: 0,
    totalRevenue: 0,
    branchEnrollments: {},
    courseEnrollments: {},
    categoryDistribution: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!loading && data.totalStudents > 0) {
      createCharts();
    }
  }, [loading, data]);

  const loadDashboardData = async () => {
    try {
      // Load students
      const studentsSnapshot = await db.collection("students").get();
      const totalStudents = studentsSnapshot.size;

      // Load courses
      const coursesSnapshot = await db.collection("courses").get();
      const totalCourses = coursesSnapshot.size;
      const courses = coursesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as { id: string; location?: string; courseName?: string; category?: string; courseFee?: string | number }));

      // Load instructors
      const instructorsSnapshot = await db.collection("instructors").get();
      const totalInstructors = instructorsSnapshot.size;

      // Load enquiries (last 7 days)
      let newEnquiries = 0;
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const studentEnquiriesSnapshot = await db.collection("studentEnquiries")
          .where("timestamp", ">=", firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
          .get();
        const visitorEnquiriesSnapshot = await db.collection("visitorinquiries")
          .where("timestamp", ">=", firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
          .get();
        newEnquiries = studentEnquiriesSnapshot.size + visitorEnquiriesSnapshot.size;
      } catch (error) {
        // If timestamp query fails, get all enquiries and filter manually
        const allStudentEnquiries = await db.collection("studentEnquiries").get();
        const allVisitorEnquiries = await db.collection("visitorinquiries").get();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentStudent = allStudentEnquiries.docs.filter(doc => {
          const timestamp = doc.data().timestamp;
          if (!timestamp) return false;
          const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
          return date >= sevenDaysAgo;
        });
        
        const recentVisitor = allVisitorEnquiries.docs.filter(doc => {
          const timestamp = doc.data().timestamp;
          if (!timestamp) return false;
          const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
          return date >= sevenDaysAgo;
        });
        
        newEnquiries = recentStudent.length + recentVisitor.length;
      }

      // Calculate branch enrollments and revenue
      const branchEnrollments: { [key: string]: number } = {};
      const courseEnrollments: { [key: string]: number } = {};
      const categoryDistribution: { [key: string]: number } = {};
      let totalRevenue = 0;

      // Process each student's enrolled courses
      for (const studentDoc of studentsSnapshot.docs) {
        const myCoursesSnapshot = await db
          .collection("students")
          .doc(studentDoc.id)
          .collection("myCourses")
          .get();

        for (const enrolledCourse of myCoursesSnapshot.docs) {
          const courseId = enrolledCourse.data().courseId;
          const course = courses.find(c => c.id === courseId);
          
          if (course) {
            // Branch enrollments
            const location = course.location || "Unknown";
            branchEnrollments[location] = (branchEnrollments[location] || 0) + 1;

            // Course enrollments
            const courseName = course.courseName || "Unknown";
            courseEnrollments[courseName] = (courseEnrollments[courseName] || 0) + 1;

            // Category distribution
            const category = course.category || "Unknown";
            categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;

            // Revenue calculation
            const courseFee = parseFloat(course.courseFee?.toString().replace(/[^0-9.]/g, "") || "0");
            totalRevenue += courseFee;
          }
        }
      }

      setData({
        totalStudents,
        totalCourses,
        totalInstructors,
        newEnquiries,
        totalRevenue,
        branchEnrollments,
        courseEnrollments,
        categoryDistribution,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCharts = () => {
    // Helper function to destroy chart if it exists
    const createChart = (ctx: HTMLCanvasElement, config: any) => {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) existingChart.destroy();
      return new Chart(ctx, config);
    };

    // Doughnut chart - Student Enrollment by Branch
    const sessionsCtx = document.getElementById("sessionsChart") as HTMLCanvasElement;
    if (sessionsCtx) {
      const branchLabels = Object.keys(data.branchEnrollments);
      const branchData = Object.values(data.branchEnrollments);
      
      if (branchLabels.length > 0) {
        createChart(sessionsCtx, {
          type: "doughnut",
          data: {
            labels: branchLabels,
            datasets: [
              {
                label: "Enrollments",
                data: branchData,
                backgroundColor: [
                  "#00796B",
                  "#00BFA5",
                  "#009688",
                  "#26A69A",
                  "#4DB6AC",
                  "#80CBC4",
                ],
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { position: "bottom" } } },
        });
      }
    }

    // Line chart - Top Courses Enrollment
    const salesCtx = document.getElementById("salesChart") as HTMLCanvasElement;
    if (salesCtx) {
      const sortedCourses = Object.entries(data.courseEnrollments)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
      
      if (sortedCourses.length > 0) {
        const courseLabels = sortedCourses.map(([name]) => name.length > 15 ? name.substring(0, 15) + "..." : name);
        const courseData = sortedCourses.map(([, count]) => count);
        
        createChart(salesCtx, {
          type: "bar",
          data: {
            labels: courseLabels,
            datasets: [
              {
                label: "Enrollments",
                data: courseData,
                borderColor: "#00796B",
                backgroundColor: "rgba(0, 121, 107, 0.1)",
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    // Bar chart - Category Distribution
    const deviceCtx = document.getElementById("deviceChart") as HTMLCanvasElement;
    if (deviceCtx) {
      const categoryLabels = Object.keys(data.categoryDistribution);
      const categoryData = Object.values(data.categoryDistribution);
      
      if (categoryLabels.length > 0) {
        createChart(deviceCtx, {
          type: "bar",
          data: {
            labels: categoryLabels,
            datasets: [
              {
                label: "Courses",
                data: categoryData,
                backgroundColor: [
                  "#4caf50",
                  "#2196f3",
                  "#f44336",
                  "#ff9800",
                  "#9c27b0",
                  "#00bcd4",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  };

  return (
    <div className="flex">
      <AdminHeader />
      <main className="flex-grow ml-0 md:ml-64 p-4 bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-20 mb-6 md:mb-6 md:mt-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome, Admin</h1>
          <p className="text-gray-600">Monitor courses, students, instructors, and events at NextGen Institute</p>
        </header>

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"> 
            <h3 className="font-semibold text-gray-600 mb-2">Total Students</h3>
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-800 mb-2">{data.totalStudents.toLocaleString()}</p>
                <span className="text-green-500 font-medium text-sm">Active Students</span>
              </>
            )}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"> 
            <h3 className="font-semibold text-gray-600 mb-2">Active Courses</h3>
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-800 mb-2">{data.totalCourses}</p>
                <span className="text-green-500 font-medium text-sm">Available Courses</span>
              </>
            )}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"> 
            <h3 className="font-semibold text-gray-600 mb-2">New Enquiries</h3>
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-800 mb-2">{data.newEnquiries}</p>
                <span className="text-blue-500 font-medium text-sm">Last 7 Days</span>
              </>
            )}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"> 
            <h3 className="font-semibold text-gray-600 mb-2">Total Revenue</h3>
            {loading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-800 mb-2">LKR {data.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <span className="text-green-500 font-medium text-sm">From Enrollments</span>
              </>
            )}
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Student Enrollment by Branch</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : Object.keys(data.branchEnrollments).length > 0 ? (
              <canvas id="sessionsChart"></canvas>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No enrollment data available
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Top Courses by Enrollment</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : Object.keys(data.courseEnrollments).length > 0 ? (
              <canvas id="salesChart"></canvas>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No course enrollment data available
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Course Category Distribution</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : Object.keys(data.categoryDistribution).length > 0 ? (
              <canvas id="deviceChart"></canvas>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
