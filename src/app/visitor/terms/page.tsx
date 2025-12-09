"use client";

import { useState } from "react";
import Link from "next/link";

const termsData = [
  {
    title: "Acceptance of Terms",
    content: <p>By accessing our website, you agree to these Terms & Conditions without modification.</p>,
  },
  {
    title: "Course Enrollment",
    content: (
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>All courses are subject to availability.</li>
        <li>Payment must be completed to access materials.</li>
        <li>Courses may be canceled due to unforeseen circumstances.</li>
      </ul>
    ),
  },
  {
    title: "Use of Services",
    content: (
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Provide accurate information during registration.</li>
        <li>No unauthorized use or account sharing.</li>
        <li>Follow all rules and guidelines set by NextGen.</li>
      </ul>
    ),
  },
  {
    title: "Payment & Refunds",
    content: (
      <p>Payments are securely processed. Refunds follow our refund policy and must be requested timely.</p>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <p>All content is protected by copyright. Do not copy or redistribute without permission.</p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>NextGen is not liable for any direct or indirect damages from using our services.</p>
    ),
  },
];

export default function TermsConditions() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins bg-teal-50 text-gray-800">
      {/* Header */}
      <header className="bg-[#004d40] text-white fixed top-0 left-0 right-0 z-50 shadow-md p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">NextGen Educational Institute</h1>
        <Link
          href="/"
          className="mt-2 inline-block bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-full text-sm sm:text-base transition-transform transform hover:scale-105"
        >
          Back to Home
        </Link>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white text-center pt-32 pb-20 px-4 rounded-b-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fadeInDown">Terms & Conditions</h2>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl opacity-90 animate-fadeInUp">
          Welcome to NextGen! Please read the terms carefully before using our website or enrolling in our courses.
        </p>
      </section>

      {/* Main */}
      <main className="container mx-auto px-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {termsData.map((term, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 shadow-md cursor-pointer transform transition-transform duration-300 hover:-translate-y-1 ${
                activeIndex === index ? "bg-teal-100" : ""
              }`}
              style={{ animationDelay: `${0.1 * (index + 1)}s`, animationName: "fadeInUpCard", animationFillMode: "forwards", opacity: 0 }}
              onClick={() => toggleAccordion(index)}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-teal-700 flex justify-between items-center">
                {term.title}
                <span className="text-2xl font-bold">{activeIndex === index ? "-" : "+"}</span>
              </h3>
              <div
                className={`overflow-hidden transition-max-height duration-500 mt-3`}
                style={{ maxHeight: activeIndex === index ? "1000px" : "0px" }}
              >
                <div className="text-gray-700">{term.content}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004d40] text-white text-center py-6 mt-12 text-sm sm:text-base">
        &copy; 2025 NextGen Educational Institute. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUpCard {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown { animation: fadeInDown 0.8s ease forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease forwards; }
      `}</style>
    </div>
  );
}
