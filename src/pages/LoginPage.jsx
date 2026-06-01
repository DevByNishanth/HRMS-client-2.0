import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
// import loginImage from "../assets/login-bg-2.svg";
// import loginImage from "../assets/bg.svg";
import loginImage from "../assets/blur4.svg";
import thunderIcon from "../assets/thunderIcon.svg";

const slides = [
  {
    title: "A Unified Hub for Smarter Financial Decision-Making",
    description:
      "Kezak empowers you with a unified financial command center, delivering deep insights and a 360° view of your entire economic world.",
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
    <main className="grid min-h-screen overflow-x-hidden bg-[#0F172A] lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
      <section className="flex min-h-screen flex-col bg-[#020817] lg:min-h-0">
        <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:py-6">
          <div className="w-full max-w-[448px]">
            <div className="mb-4">
              <img src={logo} alt="Logo" className="h-auto max-w-[180px]" />
            </div>

            <h1 className="text-xl font-semibold text-white">
              Welcome to Eshwar HRMS
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#8b9bb8]">
              Start your experience with HRMS by signing in.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm text-[#8b9bb8]">
                Email Address <span className="text-blue-500">*</span>
              </label>

              <div className="flex items-center rounded-xl border border-[#1b2942] bg-[#0b1730] px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-[#8b9bb8]"
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
                  className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm text-[#8b9bb8]">
                Password <span className="text-blue-500">*</span>
              </label>

              <div className="flex items-center rounded-xl border border-[#1b2942] bg-[#0b1730] px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-[#8b9bb8]"
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
                  className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                />

                <button
                  type="button"
                  aria-label="Show password"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#8b9bb8] transition hover:bg-white/5 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </button>
              </div>
            </div>

            <button className="mt-8 w-full rounded-xl bg-[#2563EB] py-3 text-base font-semibold text-white transition hover:bg-blue-500">
              Sign In
            </button>
          </div>
        </div>

        <footer className="mx-5 shrink-0 border-t border-[#1b2942] px-0 py-4 text-sm text-[#94A3B8] sm:mx-10">
          <div className="mx-auto flex max-w-xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p>Copyright : QuantumPulse Technologies, All Right Reserved</p>

            <div className="flex items-center gap-5">
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
      </section>

      <section className="login-gradient flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:min-h-0 lg:py-6">
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <div className="absolute h-[34vw] max-h-[360px] min-h-[220px] w-[34vw] min-w-[220px] max-w-[360px] rounded-full bg-blue-500/25 blur-[110px]" />

          <img
            src={loginImage}
            alt=""
            className="relative max-h-[52vh] w-full max-w-[520px] object-contain drop-shadow-[0_0_50px_rgba(168,15,207,0.10)] lg:max-h-[48vh]"
          />
        </div>

        <div className="flex shrink-0 items-center justify-center px-4">
          <div className="relative flex max-w-[620px] flex-col items-center justify-center overflow-hidden px-2 text-center sm:px-8">
            <img
              src={thunderIcon}
              alt=""
              className="h-11 w-11 animate-pulse sm:h-12 sm:w-12"
            />

            <h2 className="mt-5 max-w-[560px] text-balance text-[22px] font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
              {slides[activeIndex].title}
            </h2>

            <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#94a3b8]">
              {slides[activeIndex].description}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1 rounded-full transition-all ${activeIndex === index
                      ? "w-10 bg-white"
                      : "w-9 bg-[#334155] hover:bg-[#64748B]"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
