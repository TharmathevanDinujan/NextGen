"use client";

import { useState } from "react";
import Link from "next/link";

const accordionData = [
  {
    title: "Information We Collect",
    content: (
      <>
        <p>We may collect the following information:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Personal details such as name, email, phone number, and address.</li>
          <li>Educational information relevant to course registration.</li>
          <li>Payment information for course fees (securely processed).</li>
          <li>Usage data on how you interact with our website.</li>
        </ul>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>To provide and manage the courses and services you enroll in.</li>
        <li>To communicate important updates and course information.</li>
        <li>To improve our website, courses, and user experience.</li>
        <li>To comply with legal obligations.</li>
      </ul>
    ),
  },
  {
    title: "Information Sharing",
    content: (
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>With authorized staff and instructors for course administration.</li>
        <li>With trusted third-party service providers for payments or analytics.</li>
        <li>When required by law or to protect legal rights.</li>
      </ul>
    ),
  },
  {
    title: "Data Security",
    content: (
      <p>
        We implement industry-standard measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
      </p>
    ),
  },
  {
    title: "Cookies and Tracking",
    content: (
      <p>
        We may use cookies and similar technologies to enhance your browsing experience. You can disable cookies in your browser settings, but some features may not function properly.
      </p>
    ),
  },
  {
    title: "Third-Party Links",
    content: (
      <p>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites.
      </p>
    ),
  },
  {
    title: "Children's Privacy",
    content: (
      <p>
        Our services are not directed to children under 13. We do not knowingly collect personal information from children.
      </p>
    ),
  },
  {
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. The latest version will always be available on this page.
      </p>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <p>
        If you have any questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:tharmathevandinujan11@gmail.com" className="text-teal-700 underline hover:text-teal-900">
          tharmathevandinujan11@gmail.com
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-teal-50 font-poppins text-gray-800">
      {/* Header */}
      <header className="bg-[#004d40] text-white sticky top-0 z-50 shadow-md p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold animate-fadeInDown">
        NextGen Educational Institute
        </h1>
        <Link
          href="/"
          className="mt-2 inline-block bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md transition-transform transform hover:scale-105 text-sm sm:text-base"
        >
          Back to Home
        </Link>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-10 flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Privacy Policy
        </h2>

        <div className="space-y-4">
          {accordionData.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-transform duration-300 transform hover:-translate-y-1 ${
                activeIndex === index ? "bg-teal-100" : ""
              }`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-semibold text-[#004d40]">{item.title}</h3>
                <span className="text-2xl font-bold text-[#004d40]">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 mt-3 ${
                  activeIndex === index ? "max-h-[1000px]" : "max-h-0"
                }`}
              >
                <div className="text-gray-700">{item.content}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#004d40] text-white text-center py-6 mt-10 text-sm sm:text-base">
        &copy; 2025 NextGen Educational Institute. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}
