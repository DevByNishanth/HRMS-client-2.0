import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
// import loginImage from '../assets/login-bg-2.svg'
import loginImage from "../assets/bg.svg";
import { Bolt } from "lucide-react";
import thunderIcon from "../assets/thunderIcon.svg";
import GlassActiveDayCalendar from "../components/GlassActiveDayCalendar";
import GlassAttendanceGauge from "../components/GlassAttendanceGauge";
import GlassTimeTracker from "../components/GlassTimeTracker";

const slides = [
  {
    title: "A Unified Hub for Smarter Financial Decision-Making",
    description:
      "Kezak empowers you with a unified financial command center—delivering deep insights and a 360° view of your entire economic world.",
  },
  {
    title: "Track Your Financial Growth Seamlessly",
    description:
      "Monitor expenses, revenue, investments, and savings in one intelligent dashboard built for clarity and control.",
  },
  {
    title: "Powerful Analytics for Better Decisions",
    description:
      "Transform raw numbers into meaningful insights with real-time analytics and performance tracking tools.",
  },
  {
    title: "Secure & Modern Financial Experience",
    description:
      "Experience enterprise-grade security and a beautifully crafted interface designed for modern businesses.",
  },
];

const LoginPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="main-container flex bg-[#0F172A]">
        {/* form  */}
        <div className="container-1 w-[50%] relative">
          {/* form  */}
          <div className="form-container">
            <div className="min-h-screen flex items-center justify-center bg-[#020817] px-4">
              <div className="w-full max-w-md">
                <div className="logo-container mb-4">
                  <img src={logo} alt="Logo" />
                </div>

                <h1 className="text-xl font-semibold text-white ">
                  Welcome to Eshwar HRMS
                </h1>

                <p className="mt-2 text-sm text-[#8b9bb8] leading-6">
                  Start your experience with HRMS by signing in.
                </p>

                {/* Email */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm text-[#8b9bb8]">
                    Email Address <span className="text-blue-500">*</span>
                  </label>

                  <div className="flex items-center rounded-xl border border-[#1b2942] bg-[#0b1730] px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#8b9bb8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9m19.5 0A2.25 2.25 0 0019.5 5.25h-15A2.25 2.25 0 002.25 7.5m19.5 0v.243a2.25 2.25 0 01-1.07 1.917l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 012.25 7.743V7.5"
                      />
                    </svg>

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full bg-transparent px-3 py-4 text-sm text-white placeholder:text-[#6b7a99] outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm text-[#8b9bb8]">
                    Password <span className="text-blue-500">*</span>
                  </label>

                  <div className="flex items-center rounded-xl border border-[#1b2942] bg-[#0b1730] px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#8b9bb8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V7.875a4.125 4.125 0 10-8.25 0V10.5m-.75 0h9.75A2.25 2.25 0 0119.5 12.75v5.625A2.25 2.25 0 0117.25 20.625H6.75A2.25 2.25 0 014.5 18.375V12.75A2.25 2.25 0 016.75 10.5z"
                      />
                    </svg>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full bg-transparent px-3 py-4 text-sm text-white placeholder:text-[#6b7a99] outline-none"
                    />

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer text-[#8b9bb8]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25c4.477 0 8.268 2.693 9.542 6.75-1.274 4.057-5.065 6.75-9.542 6.75-4.477 0-8.268-2.693-9.542-6.75z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Button */}
                <button className="mt-8 w-full rounded-xl bg-[#2563EB] py-2 text-lg font-semibold text-white transition hover:bg-blue-500">
                  Sign In
                </button>
              </div>
            </div>
          </div>

          <div className="form-footer absolute bottom-6 left-[50%] translate-x-[-50%] w-full px-10  ">
            <footer className="border-t border-[#1b2942]  m-auto px-6 py-4">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#94A3B8] md:flex-row">
                <p>Copyright : QuantumPulse Technologies, All Right Reserved</p>

                <div className="flex items-center gap-6">
                  <button className="transition hover:text-white">
                    Term & Condition
                  </button>

                  <div className="h-5 w-px bg-[#2a3a56]" />

                  <button className="transition hover:text-white">
                    Privacy & Policy
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
        {/* login bg  */}
        <div className="container-2 w-[50%]  login-gradient">
          <div className="img-container w-[100%] mb-3  relative">
            <div className="relative flex justify-center items-center">
              <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/30 blur-[120px]" />

              <img
                src={loginImage}
                className="relative h-[490px] object-contain drop-shadow-[0_0_50px_rgba(168,15,207,0.10)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-center px-4 ">
            <div className="flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
              {/* Top Icon */}
              <img
                src={thunderIcon}
                alt="Thunder Icon"
                className="w-16 h-16 animate-pulse"
              />

              {/* Heading */}
              <h1 className="text-white text-[24px] leading-[42px] w-[80%] font-semibold tracking-[-1px]">
                A Unified Hub for Smarter Financial Decision-Making
              </h1>

              {/* Description */}
              <p className="text-[#94a3b8] text-sm leading-6 mt-2 max-w-[90%]">
                Kezak empowers you with a unified financial command center—
                delivering deep insights and a 360° view of your entire economic
                world.
              </p>

              {/* Slider Indicators */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-10 h-[4px] rounded-full bg-white"></div>
                <div className="w-10 h-[4px] rounded-full bg-[#334155]"></div>
                <div className="w-10 h-[4px] rounded-full bg-[#334155]"></div>
                <div className="w-10 h-[4px] rounded-full bg-[#334155]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
