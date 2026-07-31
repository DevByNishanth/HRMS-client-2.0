import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import loginImage from "../assets/blur4.svg";
import thunderIcon from "../assets/thunderIcon.svg";
import { getRoleBasedRoute } from "../utils/tokenUtils";

const slides = [
  {
    title: "A Unified Hub for Workforce Management",
    description:
      "Manage employees, attendance, leave, payroll, and performance from a single HRMS platform designed for modern organizations.",
  },
  {
    title: "Simplify Attendance & Leave Tracking",
    description:
      "Track employee attendance, shifts, holidays, and leave requests effortlessly with automated workflows and real-time visibility.",
  },
  {
    title: "Streamline Payroll & Employee Records",
    description:
      "Process payroll accurately, maintain employee information securely, and ensure compliance with integrated HR operations.",
  },
  {
    title: "Empower Your People with Smart HR Tools",
    description:
      "Enhance employee engagement, performance management, and self-service experiences through an intuitive and secure HRMS solution.",
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDocumentUploadModal, setOpenDocumentUploadModal] = useState(false);

  // OTP verification state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(300);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  // Forgot password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(0); // 0: email, 1: otp, 2: new password
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotOtpTimer, setForgotOtpTimer] = useState(300);
  const [forgotOtpExpired, setForgotOtpExpired] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://sece_hrms_server.onrender.com";

    console.log("vite api : ",  API_BASE_URL)

    
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (!isOtpStep) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOtpStep]);

  // Forgot password OTP countdown timer
  useEffect(() => {
    if (!isForgotPassword || forgotStep !== 1) return;

    const interval = setInterval(() => {
      setForgotOtpTimer((prev) => {
        if (prev <= 1) {
          setForgotOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isForgotPassword, forgotStep]);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (!email.endsWith("@sece.ac.in")) {
      newErrors.email = "Email must be from @sece.ac.in domain";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          data?.message || data?.error || "Login failed. Please try again.";
        setApiError(errorMessage);
        setIsLoading(false);
        return;
      }

      // If no token in response, this means OTP verification is required
      if (data && !data?.token) {
        setIsOtpStep(true);
        setOtpTimer(300);
        setOtpExpired(false);
        setOtp("");
        setOtpError("");
        setSuccessMessage(
          data?.message ||
            "OTP sent to your email. Please check and enter the OTP below.",
        );
        setIsLoading(false);
        return;
      }

      // Store token in localStorage (for backward compatibility)
      if (data?.token) {
        localStorage.setItem("hrms_token", data.token);
      }

      // Show success message
      setSuccessMessage("Login successful! Redirecting...");

      // set open document modal 

      // setOpenDocumentUploadModal(true)

      // Redirect to role-based dashboard after a short delay
      setTimeout(() => {
        navigate(getRoleBasedRoute());
      }, 1500);
    } catch (error) {
      setApiError(
        error.message || "An error occurred during login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp.trim().length < 4) {
      setOtpError("Please enter a valid OTP");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/auth/verify-login-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          data?.message || data?.error || "Invalid OTP. Please try again.";
        setOtpError(errorMessage);
        setOtpLoading(false);
        return;
      }

      // Store token in localStorage
      if (data?.token) {
        localStorage.setItem("hrms_token", data.token);
      }

      // Show success message
      setSuccessMessage("Login successful! Redirecting...");

      // Redirect to role-based dashboard after a short delay
      setTimeout(() => {
        navigate(getRoleBasedRoute());
      }, 1500);
    } catch (error) {
      setOtpError(error.message || "An error occurred. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotPasswordSendOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!email.trim()) {
      setForgotError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setForgotError("Please enter a valid email address");
      return;
    }

    if (!email.endsWith("@sece.ac.in")) {
      setForgotError("Email must be from @sece.ac.in domain");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setForgotError(
          data?.message || data?.error || "Failed to send OTP. Please try again.",
        );
        setForgotLoading(false);
        return;
      }

      setForgotStep(1);
      setForgotOtp("");
      setForgotOtpTimer(300);
      setForgotOtpExpired(false);
      setForgotSuccess(data?.message || "OTP sent to your email.");
    } catch (error) {
      setForgotError(error.message || "An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotPasswordVerifyOtp = (e) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotOtp.trim()) {
      setForgotError("Please enter the OTP");
      return;
    }

    if (forgotOtp.trim().length < 4) {
      setForgotError("Please enter a valid OTP");
      return;
    }

    setForgotStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!newPassword.trim()) {
      setForgotError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: forgotOtp.trim(),
            newPassword,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setForgotError(
          data?.message || data?.error || "Failed to reset password. Please try again.",
        );
        setForgotLoading(false);
        return;
      }

      setForgotSuccess(data?.message || "Password reset successful! Redirecting to login...");

      setTimeout(() => {
        handleBackToLogin();
      }, 2000);
    } catch (error) {
      setForgotError(error.message || "An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleStartForgotPassword = () => {
    setIsForgotPassword(true);
    setForgotStep(0);
    setForgotOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
    setForgotSuccess("");
    setForgotOtpTimer(300);
    setForgotOtpExpired(false);
    setApiError("");
    setSuccessMessage("");
  };

  const handleBackToLogin = () => {
    setIsOtpStep(false);
    setOtp("");
    setOtpError("");
    setOtpExpired(false);
    setOtpTimer(300);
    setApiError("");
    setSuccessMessage("");
    setIsForgotPassword(false);
    setForgotStep(0);
    setForgotOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
    setForgotSuccess("");
    setForgotOtpTimer(300);
    setForgotOtpExpired(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <main className="grid min-h-screen overflow-x-hidden bg-[#0F172A] lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
     
      <section className="flex min-h-screen flex-col bg-[#020817] lg:min-h-0">
        <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:py-6">
          <div className="w-full max-w-[448px]">
            <div className="mb-4">
              <img src={logo} alt="Logo" className="h-auto max-w-[180px]" />
            </div>

            {isForgotPassword ? (
              <>
                {/* --- Forgot Password Step 0: Enter Email --- */}
                {forgotStep === 0 && (
                  <>
                    <h1 className="text-xl font-semibold text-white">
                      Forgot Password
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#8b9bb8]">
                      Enter your registered email to receive an OTP.
                    </p>

                    <div className="mt-6">
                      <label className="mb-2 block text-md text-[#8b9bb8]">
                        Email Address <span className="text-blue-500">*</span>
                      </label>
                      <div className="flex items-center rounded-xl border border-[#1b2942] bg-[#0b1730] px-4 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-[#8b9bb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9m19.5 0A2.25 2.25 0 0019.5 5.25h-15A2.25 2.25 0 002.25 7.5m19.5 0v.243a2.25 2.25 0 01-1.07 1.917l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 012.25 7.743V7.5" />
                        </svg>
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setForgotError(""); }}
                          autoComplete="off"
                          className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                        />
                      </div>
                    </div>

                    {forgotError && (
                      <div className="mt-4 rounded-lg bg-[#f1686812] px-4 py-3 text-sm text-[#f16868]">
                        {forgotError}
                      </div>
                    )}

                    {forgotSuccess && (
                      <div className="mt-4 rounded-lg bg-[#18d3bf1f] px-4 py-3 text-sm text-[#18d3bf]">
                        {forgotSuccess}
                      </div>
                    )}

                    <button
                      onClick={handleForgotPasswordSendOtp}
                      disabled={forgotLoading}
                      className="mt-8 w-full rounded-xl bg-[#2563EB] py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? "Sending OTP..." : "Send OTP"}
                    </button>

                    <button
                      onClick={handleBackToLogin}
                      className="mt-4 w-full text-center text-xs text-[#8b9bb8] underline transition hover:text-white"
                    >
                      Back to Sign In
                    </button>
                  </>
                )}
                  
               

                {/* --- Forgot Password Step 1: Enter OTP --- */}
                {forgotStep === 1 && (
                  <>
                    <h1 className="text-xl font-semibold text-white">
                      Verify OTP
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#8b9bb8]">
                      Enter the OTP sent to your email.
                    </p>

                    <div className="mt-6 rounded-lg p-4">
                      <div className="mb-3 text-center">
                        <p className="text-sm text-[#8b9bb8]">
                          OTP sent to{" "}
                          <span className="font-medium text-white">{email}</span>
                        </p>
                      </div>

                      <label className="mb-2 block text-sm text-[#8b9bb8]">
                        Enter OTP <span className="text-blue-500">*</span>
                      </label>
                      <div className={`flex items-center rounded-xl border bg-[#0b1730] px-4 transition ${forgotError ? "border-[#f16868]" : "border-[#1b2942]"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-[#8b9bb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.558.425l-2.42 2.42a.75.75 0 01-1.06 0l-.75-.75a.75.75 0 010-1.06l2.42-2.42c.399-.399.522-.995.425-1.558A6 6 0 1115.75 5.25z" />
                        </svg>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter OTP"
                          value={forgotOtp}
                          onChange={(e) => { setForgotOtp(e.target.value.replace(/\D/g, "")); if (forgotError) setForgotError(""); }}
                          maxLength={6}
                          autoComplete="one-time-code"
                          className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                          onKeyDown={(e) => { if (e.key === "Enter" && forgotOtp.trim().length >= 4) handleForgotPasswordVerifyOtp(e); }}
                        />
                        <span className={`shrink-0 text-sm font-medium ${forgotOtpTimer <= 60 ? "text-[#f16868]" : "text-[#8b9bb8]"}`}>
                          {forgotOtpExpired ? "Expired" : formatTime(forgotOtpTimer)}
                        </span>
                      </div>

                      {forgotError && (
                        <p className="mt-1 text-xs text-[#f16868]">{forgotError}</p>
                      )}

                      <button
                        onClick={handleForgotPasswordVerifyOtp}
                        disabled={!forgotOtp.trim()}
                        className="mt-4 w-full rounded-xl bg-[#2563EB] py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Verify OTP
                      </button>

                      {forgotOtpExpired && (
                        <p className="mt-3 text-center text-xs text-[#f16868]">
                          OTP has expired.{" "}
                          <button
                            onClick={handleForgotPasswordSendOtp}
                            className="font-medium text-[#3984ff] underline hover:text-blue-400"
                          >
                            Resend OTP
                          </button>
                        </p>
                      )}

                      <button
                        onClick={handleBackToLogin}
                        className="mt-3 w-full text-center text-xs text-[#8b9bb8] underline transition hover:text-white"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </>
                )}

                {/* --- Forgot Password Step 2: New Password --- */}
                {forgotStep === 2 && (
                  <>
                    <h1 className="text-xl font-semibold text-white">
                      Reset Password
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#8b9bb8]">
                      Enter your new password.
                    </p>

                    <div className="mt-6">
                      <label className="mb-2 block text-md text-[#8b9bb8]">
                        New Password <span className="text-blue-500">*</span>
                      </label>
                      <div className="flex items-center rounded-xl border border-[#1b2942] bg-[#0b1730] px-4 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-[#8b9bb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.125 4.125 0 10-8.25 0V10.5m-.75 0h9.75A2.25 2.25 0 0119.5 12.75v5.625A2.25 2.25 0 0117.25 20.625H6.75A2.25 2.25 0 014.5 18.375V12.75A2.25 2.25 0 016.75 10.5z" />
                        </svg>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); setForgotError(""); }}
                          autoComplete="off"
                          className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label="Toggle password visibility"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#8b9bb8] transition hover:bg-white/5 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            {showNewPassword ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            ) : (
                              <><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25c4.477 0 8.268 2.693 9.542 6.75-1.274 4.057-5.065 6.75-9.542 6.75-4.477 0-8.268-2.693-9.542-6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="mb-2 block text-md text-[#8b9bb8]">
                        Confirm Password <span className="text-blue-500">*</span>
                      </label>
                      <div className="flex items-center rounded-xl border border-[#1b2942] bg-[#0b1730] px-4 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-[#8b9bb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.125 4.125 0 10-8.25 0V10.5m-.75 0h9.75A2.25 2.25 0 0119.5 12.75v5.625A2.25 2.25 0 0117.25 20.625H6.75A2.25 2.25 0 014.5 18.375V12.75A2.25 2.25 0 016.75 10.5z" />
                        </svg>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setForgotError(""); }}
                          autoComplete="off"
                          className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Toggle confirm password visibility"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#8b9bb8] transition hover:bg-white/5 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            {showConfirmPassword ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            ) : (
                              <><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25c4.477 0 8.268 2.693 9.542 6.75-1.274 4.057-5.065 6.75-9.542 6.75-4.477 0-8.268-2.693-9.542-6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    {forgotError && (
                      <div className="mt-4 rounded-lg bg-[#f1686812] px-4 py-3 text-sm text-[#f16868]">
                        {forgotError}
                      </div>
                    )}
           

                    {forgotSuccess && (
                      <div className="mt-4 rounded-lg bg-[#18d3bf1f] px-4 py-3 text-sm text-[#18d3bf]">
                        {forgotSuccess}
                      </div>
                    )}

                    <button
                      onClick={handleResetPassword}
                      disabled={forgotLoading}
                      className="mt-8 w-full rounded-xl bg-[#2563EB] py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? "Resetting..." : "Reset Password"}
                    </button>

                    <button
                      onClick={handleBackToLogin}
                      className="mt-4 w-full text-center text-xs text-[#8b9bb8] underline transition hover:text-white"
                    >
                      Back to Sign In
                    </button>
                  </>
                )}
              </>
            ) : isOtpStep ? (
              <>
                <h1 className="text-xl font-semibold text-white">Verify OTP</h1>

                <p className="mt-2 text-sm leading-6 text-[#8b9bb8]">
                  Enter the OTP sent to your registered email.
                </p>

                <div className="mt-6 rounded-lg ] p-4">
                  <div className="mb-3 text-center">
                    <p className="text-sm text-[#8b9bb8]">
                      OTP sent to{" "}
                      <span className="font-medium text-white">{email}</span>
                    </p>
                  </div>

                  <label className="mb-2 block text-sm text-[#8b9bb8]">
                    Enter OTP <span className="text-blue-500">*</span>
                  </label>

                  <div
                    className={`flex items-center rounded-xl border bg-[#0b1730] px-4 transition ${otpError ? "border-[#f16868]" : "border-[#1b2942]"}`}
                  >
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
                        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.558.425l-2.42 2.42a.75.75 0 01-1.06 0l-.75-.75a.75.75 0 010-1.06l2.42-2.42c.399-.399.522-.995.425-1.558A6 6 0 1115.75 5.25z"
                      />
                    </svg>

                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtp(value);
                        if (otpError) setOtpError("");
                      }}
                      maxLength={6}
                      autoComplete="one-time-code"
                      className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.trim().length >= 4) {
                          handleVerifyOtp(e);
                        }
                      }}
                    />

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          otpTimer <= 60 ? "text-[#f16868]" : "text-[#8b9bb8]"
                        }`}
                      >
                        {otpExpired ? "Expired" : formatTime(otpTimer)}
                      </span>
                    </div>
                  </div>

                  {otpError && (
                    <p className="mt-1 text-xs text-[#f16868]">{otpError}</p>
                  )}

                  {successMessage && (
                    <div className="mt-3 rounded-lg bg-[#18d3bf1f] px-4 py-3 text-sm text-[#18d3bf]">
                      {successMessage}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || !otp.trim()}
                    className="mt-4 w-full rounded-xl bg-[#2563EB] py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>

                  {otpExpired && (
                    <p className="mt-3 text-center text-xs text-[#f16868]">
                      OTP has expired.{" "}
                      <button
                        onClick={handleBackToLogin}
                        className="font-medium text-[#3984ff] underline hover:text-blue-400"
                      >
                        Sign in again to receive a new OTP
                      </button>
                    </p>
                  )}

                  {!otpExpired && (
                    <button
                      onClick={handleBackToLogin}
                      className="mt-3 w-full text-center text-xs text-[#8b9bb8] underline hover:text-white transition"
                    >
                      Back to Sign In
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-white">
                  Welcome to Eshwar HRMS
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#8b9bb8]">
                  Start your experience with HRMS by signing in.
                </p>

                <div className="mt-6">
                  <label className="mb-2 block text-md text-[#8b9bb8]">
                    Email Address <span className="text-blue-500">*</span>
                  </label>

                  <div
                    className={`flex items-center rounded-xl border bg-[#0b1730] px-4 transition ${errors.email ? "border-[#f16868]" : "border-[#1b2942]"}`}
                  >
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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#f16868]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-md text-[#8b9bb8]">
                    Password <span className="text-blue-500">*</span>
                  </label>

                  <div
                    className={`flex items-center rounded-xl border bg-[#0b1730] px-4 transition ${errors.password ? "border-[#f16868]" : "border-[#1b2942]"}`}
                  >
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors({ ...errors, password: "" });
                      }}
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-[#6b7a99]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
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
                        {showPassword ? (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-[#f16868]">
                      {errors.password}
                    </p>
                  )}
                </div>

                {apiError && (
                  <div className="mt-4 rounded-lg bg-[#f1686812] px-4 py-3 text-sm text-[#f16868]">
                    {apiError}
                  </div>
                )}

                {successMessage && (
                  <div className="mt-4 rounded-lg bg-[#18d3bf1f] px-4 py-3 text-sm text-[#18d3bf]">
                    {successMessage}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="mt-8 w-full rounded-xl bg-[#2563EB] py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleStartForgotPassword}
                    className="text-sm text-[#8b9bb8] underline transition hover:text-white"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="mx-5 shrink-0 border-t border-[#1b2942] px-0 py-4 text-sm text-[#94A3B8] ">
          <div className="mx-auto flex max-w-xl flex-col items-center justify-between gap-3 text-center ">
            <p className="">
              Copyright : QuantumPulse Technologies, All Right Reserved
            </p>
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
                  className={`h-1 rounded-full transition-all ${
                    activeIndex === index
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
