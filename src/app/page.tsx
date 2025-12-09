"use client";
import { useEffect, useRef, useState } from "react";
import VisitorHeader from "../../components/VisitorHeader";
import WhatsAppContact from "../../components/WhatsAppContact";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function VisitorHome() {
  const courses = [
    { src: "/images/cybersecurity.webp", title: "Cybersecurity", desc: "Learn how to protect systems and data from digital threats and attacks." },
    { src: "/images/devops.webp", title: "DevOps Engineering", desc: "Master CI/CD pipelines, automation, and cloud-based deployment workflows." },
    { src: "/images/cloudcomputing.webp", title: "Cloud Computing", desc: "Gain hands-on experience with AWS, Azure, and Google Cloud platforms." },
    { src: "/images/datascience.webp", title: "Data Science & Analytics", desc: "Explore data visualization, machine learning, and predictive analytics." },
    { src: "/images/ai.webp", title: "Artificial Intelligence", desc: "Understand neural networks, AI models, and intelligent automation." },
    { src: "/images/networking.webp", title: "Computer Networking", desc: "Learn network configuration, security, and administration techniques." },
    { src: "/images/softwareengineering.webp", title: "Software Engineering", desc: "Design and build scalable software solutions with best practices." },
    { src: "/images/database.webp", title: "Database Management", desc: "Master SQL, NoSQL, and database optimization for modern applications." },
    { src: "/images/uiux.webp", title: "UI/UX Design", desc: "Learn to design engaging and user-friendly digital interfaces." },
    { src: "/images/mobileapp.webp", title: "Mobile App Development", desc: "Create Android and iOS apps using Flutter, React Native, and Kotlin." },
  ];

  const sliderCourses = [...courses, ...courses];
  const [stats, setStats] = useState({ students: 0, instructors: 0, years: 0 });
  const counterRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const targets = { students: 4000, instructors: 80, years: 15 };
          const duration = 2500;
          const step = 20;

          const animate = (key: keyof typeof targets) => {
            let count = 0;
            const increment = targets[key] / (duration / step);
            const interval = setInterval(() => {
              count += increment;
              if (count >= targets[key]) {
                count = targets[key];
                clearInterval(interval);
              }
              setStats((prev) => ({ ...prev, [key]: Math.floor(count) }));
            }, step);
          };

          animate("students");
          animate("instructors");
          animate("years");
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [started]);

  const testimonials = [
    { text: `"NextGen transformed my career. The practical sessions helped me land my first job."`, name: "Mr.Dinujan", role: "DevOps Graduate, 2022" },
    { text: `"The instructors are knowledgeable and provided excellent hands-on training in software and web development. I gained real technical skills."`, name: "Mrs.Thadshika", role: "Data Analyst" },
    { text: `"The practical IT sessions were thorough and helped me build confidence in handling real-world coding and computing projects."`, name: "Mr.Sivan", role: "Computer Science Graduate, 2024" },
  ];

  const cardRefs = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("slide-in");
        });
      },
      { threshold: 0.2 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-[Poppins] bg-[#e0f2f1] text-[#333] overflow-x-hidden">
      <VisitorHeader />
      <WhatsAppContact />

      {/* Hero Section */}
      <section
        className="relative text-center py-24 px-4 flex flex-col items-center justify-center bg-cover text-[#e0f2f1] bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/heroimage.webp')" }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">Empowering Skills for a Brighter Future</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 animate-fadeInUp delay-200">Your journey to professional excellence starts here.</p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-400">
          <Link href="/visitor/course" className="btn-modern-primary btn-modern-icon">
            <span>Explore Courses</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link href="/auth/register" className="btn-modern-secondary btn-modern-icon">
            <span>Register Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 md:px-16 text-center bg-white">
        <h2 className="text-3xl font-bold text-[#004d40] mb-6">About NextGen Institute</h2>
        <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
          At <strong>NextGen Institute</strong>, we’re committed to transforming education through innovation and practical learning.
          Our programs are designed to bridge the gap between classroom knowledge and real-world skills, ensuring every student is ready to succeed in their chosen career path.
        </p>
      </section>

      {/* Stats Section */}
      <section ref={counterRef} className="relative py-16 flex flex-col md:flex-row bg-[#004d40] justify-around items-center gap-8 text-center text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-25 z-0" style={{ backgroundImage: "url('/images/number.webp')" }}></div>
        <div className="relative z-10 transition-transform hover:scale-110 duration-500">
          <h3 className="text-5xl font-extrabold">{stats.students}+</h3>
          <p className="text-lg">Students Trained</p>
        </div>
        <div className="relative z-10 transition-transform hover:scale-110 duration-500">
          <h3 className="text-5xl font-extrabold">{stats.instructors}+</h3>
          <p className="text-lg">Expert Instructors</p>
        </div>
        <div className="relative z-10 transition-transform hover:scale-110 duration-500">
          <h3 className="text-5xl font-extrabold">{stats.years}+</h3>
          <p className="text-lg">Years of Excellence</p>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="my-16 px-4">
        <h2 className="text-center text-3xl font-bold text-[#004d40] mb-8">Featured Courses</h2>
        <div className="overflow-hidden">
          <div className="flex w-max animate-slideCourses">
            {sliderCourses.map((course, idx) => (
              <div key={idx} className="min-w-[250px] card-modern-gradient p-4 flex-shrink-0 text-center mx-2">
                <Image src={course.src} alt={course.title} width={250} height={150} className="w-full h-36 object-cover rounded-xl mb-4 shadow-md" />
                <h3 className="font-bold text-lg mb-2 text-[#004d40]">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="my-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-[#004d40] mb-8">What Our Students Say</h2>
        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="max-w-md mx-auto text-center px-4 py-6 card-modern-gradient">
              <p className="italic text-gray-800 leading-relaxed">{t.text}</p>
              <span className="block mt-3 font-semibold text-[#004d40] text-lg">{t.name}</span>
              <div className="text-[#00796b] font-medium text-sm mt-1">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004d40] text-[#e0f2f1] py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-3">NextGen Institute</h3>
            <p>Empowering students with practical IT skills and industry knowledge for a successful future.</p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <Link href="https://www.facebook.com/share/1HFjjSA4q6/" target="_blank" className="hover:text-blue-400 text-2xl"><FaFacebook /></Link>
              <Link href="https://www.instagram.com/d_i_n_u_75?igsh=cGo5YXMzc200enZ0" target="_blank" className="hover:text-pink-400 text-2xl"><FaInstagram /></Link>
              <Link href="https://www.linkedin.com/in/tharmathevan-dinujan-021a54294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" className="hover:text-blue-500 text-2xl"><FaLinkedin /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/visitor/course" className="hover:underline">Courses</Link></li>
              <li><Link href="/auth/register" className="hover:underline">Register</Link></li>
              <li><Link href="/visitor/contact" className="hover:underline">Contact Us</Link></li>
             
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-3">Contact Us</h3>
            <p className="flex items-center justify-center md:justify-start gap-2"><FaMapMarkerAlt /> 1/3, Hill street Gampola, Sri Lanka</p>
            <p className="flex items-center justify-center md:justify-start gap-2"><FaEnvelope /> info@nextgen.edu.lk</p>
            <p className="flex items-center justify-center md:justify-start gap-2"><FaPhone /> +94 76 190 9286</p>
          </div>
        </div>

        <div className="text-center text-sm mt-8 border-t border-[#00796b] pt-3">
          <p>&copy; 2025 NextGen Institute. All Rights Reserved.</p>
          <div className="mt-1">
            <Link href="visitor/privacy-policy" className="hover:underline mx-1">Privacy Policy</Link> |
            <Link href="visitor/terms" className="hover:underline mx-1">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideCourses { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-slideCourses { animation: slideCourses 40s linear infinite; }

        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 1s ease forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }

        .slide-left { transform: translateX(-100px); opacity: 0; }
        .slide-right { transform: translateX(100px); opacity: 0; }
        .slide-in { transform: translateX(0) !important; opacity: 1 !important; }
      `}</style>
    </div>
  );
}
