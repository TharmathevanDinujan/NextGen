"use client";
import VisitorHeader from "../../components/VisitorHeader";
import Image from "next/image";
import Link from "next/link";

export default function VisitorHome() {
  const courses = [
    {
      src: "/images/web develop.webp",
      title: "ICT & Web Development",
      desc: "Learn programming, web design, and development with hands-on training.",
    },
    {
      src: "/images/hotelmanagemnet.webp",
      title: "Hotel Management",
      desc: "Gain essential skills in hospitality, tourism, and professional management.",
    },
    {
      src: "/images/plumbing.jpeg",
      title: "Plumbing & Welding",
      desc: "Practical vocational training with real-world applications.",
    },
    {
      src: "/images/humanresourcses.jpg",
      title: "Human Resources",
      desc: "Master HR management and organizational skills for corporate success.",
    },
  ];

  // Duplicate courses for seamless scroll
  const sliderCourses = [...courses, ...courses];

  return (
    <div className="font-[Poppins] bg-[#e0f2f1] text-[#333]">
      {/* Header */}
      <VisitorHeader />

      {/* Hero Section */}
      <section
        className="relative text-center py-24 px-4 flex flex-col items-center justify-center bg-cover text-[#e0f2f1] bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Empowering Skills for a Brighter Future
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6">
          Your journey to professional excellence starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/visitor/course"
            className="bg-[#00796b] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#004d40] transition-colors"
          >
            Explore Courses
          </Link>
          <Link
            href="/auth/register"
            className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-[#004d40] transition-colors"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="my-16 px-4">
        <h2 className="text-center text-3xl font-bold text-[#004d40] mb-8">
          Featured Courses
        </h2>

        {/* Auto-sliding container */}
        <div className="overflow-hidden">
          <div className="flex w-max animate-slideCourses">
            {sliderCourses.map((course, idx) => (
              <div
                key={idx}
                className="min-w-[250px] bg-white rounded-xl shadow-md p-4 flex-shrink-0 text-center hover:-translate-y-1 transition-transform mx-2"
              >
                <Image
                  src={course.src}
                  alt={course.title}
                  width={250}
                  height={150}
                  className="w-full h-36 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-sm">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="my-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-[#004d40] mb-8">
          What Our Students Say
        </h2>
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center">
          {[
            {
              text: `"NextGen transformed my career. The practical sessions helped me land my first job."`,
              name: "Sivanujan",
              role: "ICT Graduate, 2022",
            },
            {
              text: `"The instructors are knowledgeable and provide hands-on guidance. I gained real skills in hotel management."`,
              name: "Thushy",
              role: "Hotel Management Student, 2017",
            },
            {
              text: `"The vocational training in plumbing and welding was thorough. I now have confidence to take on real projects."`,
              name: "Dinujan",
              role: "Vocational Student, 2024",
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="relative bg-[#f1f8e9] p-6 rounded-2xl shadow-lg flex flex-col gap-2 max-w-sm mx-auto"
            >
              <span className="absolute top-[-10px] left-2 text-4xl text-[#00796b] opacity-30">“</span>
              <p className="italic">{t.text}</p>
              <span className="font-semibold text-[#004d40]">{t.name}</span>
              <div className="text-[#00796b] font-medium text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004d40] text-[#e0f2f1] text-center py-3">
        <p>&copy; 2025 NextGen Institute. All Rights Reserved.</p>
        <div className="mt-1">
          <Link href="/privacy-policy" className="hover:underline mx-1">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms" className="hover:underline mx-1">
            Terms & Conditions
          </Link>
        </div>
      </footer>

      {/* Tailwind keyframes for auto-slide */}
      <style jsx>{`
        @keyframes slideCourses {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slideCourses {
          animation: slideCourses 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
