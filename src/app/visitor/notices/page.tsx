"use client";

import { useEffect, useState } from "react";
import VisitorHeader from "../../../../components/VisitorHeader";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { JSX } from "react/jsx-runtime";

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

interface Announcement {
  id: string;
  title: string;
  message: string;
  eventDate?: firebase.firestore.Timestamp | string;
  status: string;
}

export default function NoticesPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Load announcements
  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const snapshot = await db.collection("announcements")
        .where("status", "==", "Published")
        .get();

      const data: Announcement[] = [];
      const eventDates: string[] = [];

      snapshot.forEach((doc) => {
        const ann = { id: doc.id, ...doc.data() } as Announcement;
        data.push(ann);

        let dateStr = "-";
        if (ann.eventDate instanceof firebase.firestore.Timestamp) {
          const d = ann.eventDate.toDate();
          dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        } else if (typeof ann.eventDate === "string") {
          dateStr = ann.eventDate;
        }
        if(dateStr !== "-") eventDates.push(dateStr);
      });

      setAnnouncements(data);
      setEvents(eventDates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Calendar logic
  const renderCalendarDays = () => {
    const days: JSX.Element[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isEvent = events.includes(dateStr);
      days.push(
        <div
          key={d}
          className={`calendar-day flex justify-center items-center p-3 rounded-md cursor-pointer transition-transform duration-200 ${
            isEvent ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-teal-600 hover:text-white transform hover:scale-110"
          }`}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <VisitorHeader />

      <main className="container mx-auto font-poppins">
        {/* Hero */}
        <section className="bg-gradient-to-r from-teal-600 to-teal-900 text-white text-center rounded-b-3xl pt-24 pb-11 px-4 mb-10">
          <h1 className="text-4xl font-bold mb-3">Notices & Events</h1>
          <p className="text-lg">Stay updated with the latest announcements, events, and calendars from NextGen Institute.</p>
        </section>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Notices */}
          <section>
            <h2 className="text-2xl font-bold text-teal-900 px-3 mb-5">Latest Notices</h2>

            {/* Skeleton UI while loading */}
            {loading ? (
              <div className="flex flex-col gap-5 px-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-xl shadow-md animate-pulse"
                  >
                    <div className="h-5 bg-gray-300 rounded w-2/3 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-gray-600 px-3">No published announcements found.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {announcements.map((ann) => {
                  let eventDateStr = "-";
                  if (ann.eventDate instanceof firebase.firestore.Timestamp) {
                    const d = ann.eventDate.toDate();
                    eventDateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                  } else if (typeof ann.eventDate === "string") {
                    eventDateStr = ann.eventDate;
                  }

                  return (
                    <div
                      key={ann.id}
                      className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2"
                    >
                      <h3 className="text-teal-700 text-xl font-semibold mb-2">{ann.title || "No Title"}</h3>
                      <p className="text-gray-700 mb-2">{ann.message || "No Message"}</p>
                      <span className="text-gray-500 text-sm">📅 {eventDateStr}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Events Calendar */}
          <section>
            <h2 className="text-2xl font-bold text-teal-900 px-3 mb-5">Event Calendar</h2>
            <div className="bg-white p-5 rounded-xl shadow-md">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <button
                  className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                >
                  &laquo;
                </button>
                <h4 className="text-teal-900 font-semibold text-lg">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                <button
                  className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                >
                  &raquo;
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 text-center font-semibold text-teal-900 mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-4 mt-10">
        &copy; 2025 NextGen Institute. All rights reserved.
      </footer>
    </div>
  );
}
