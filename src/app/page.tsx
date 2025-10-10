"use client";
import { useEffect, useRef, useState } from "react";
import VisitorHeader from "../../components/VisitorHeader";
import Image from "next/image";
import Link from "next/link";

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
    { text: `"The instructors are knowledgeable and provided excellent hands-on training in software and web development. I gained real technical skills."`, name: "Mrs.Thadshika",role: "Data Analyst" },
    { text: `"The practical IT sessions were thorough and helped me build confidence in handling real-world coding and computing projects."`, name: "Mr.Sivan", role: "Computer Science Graduate, 2024" },
  ];

  // Scroll animation for zig-zag cards
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

      {/* Hero Section */}
      <section
        className="relative text-center py-24 px-4 flex flex-col items-center justify-center bg-cover text-[#e0f2f1] bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/heroimage.webp')" }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">Empowering Skills for a Brighter Future</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 animate-fadeInUp delay-200">Your journey to professional excellence starts here.</p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-400">
          <Link href="/visitor/course" className="bg-[#00796b] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#004d40] transition-colors">Explore Courses</Link>
          <Link href="/auth/register" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-[#004d40] transition-colors">Register Now</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 md:px-16 text-center bg-white">
        <h2 className="text-3xl font-bold text-[#004d40] mb-6">About NextGen Institute</h2>
        <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
          At <strong>NextGen Institute</strong>, we’re committed to transforming education through innovation and practical learning. Our programs are designed to bridge the gap between classroom knowledge and real-world skills, ensuring every student is ready to succeed in their chosen career path.
        </p>
      </section>

    {/* Animated Stats Section with Background Images */}
<section ref={counterRef} className="relative py-16 flex flex-col md:flex-row bg-[#004d40] justify-around items-center gap-8 text-center text-white">
  {/* Background overlay */}
  <div className="absolute inset-0 bg-cover bg-center opacity-25 z-0" style={{ backgroundImage: "url('/images/number.webp')" }}></div>

  {/* Stats cards */}
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
              <div key={idx} className="min-w-[250px] bg-white rounded-xl shadow-md p-4 flex-shrink-0 text-center hover:-translate-y-1 transition-transform mx-2">
                <Image src={course.src} alt={course.title} width={250} height={150} className="w-full h-36 object-cover rounded-lg mb-4" />
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-sm">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* Modern Testimonials */}
      <section className="my-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-[#004d40] mb-8">What Our Students Say</h2>
        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="max-w-md mx-auto text-center px-4 py-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500">
              <p className="italic text-gray-800">{t.text}</p>
              <span className="block mt-3 font-semibold text-[#004d40]">{t.name}</span>
              <div className="text-[#00796b] font-medium text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004d40] text-[#e0f2f1] text-center py-3">
        <p>&copy; 2025 NextGen Institute. All Rights Reserved.</p>
        <div className="mt-1">
          <Link href="visitor/privacy-policy" className="hover:underline mx-1">Privacy Policy</Link> | <Link href="visitor/terms" className="hover:underline mx-1">Terms & Conditions</Link>
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
