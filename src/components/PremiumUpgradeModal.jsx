import { useEffect, useState } from "react";
import { FaCrown, FaSpinner, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../config/api";


const PremiumUpgradeModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "OTP sent successfully!");
        setStep(2);
        setCountdown(180); // 3 minutes = 180 seconds
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Send OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp(["", "", "", "", "", ""]);
    await handleSendOTP();
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Premium membership activated!");
        sessionStorage.setItem("premium_member", "true");

        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-0").focus();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Verify OTP error:", error);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0").focus();
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#000000",
          border: "2px solid #06b6d4",
          color: "#ffffff",
        }}
        progressStyle={{
          background: "#06b6d4",
        }}
      />
      <div className="bg-gray-900 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <FaCrown className="text-yellow-400 text-5xl mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Premium
          </h2>
          <p className="text-gray-400 text-sm">
            {step === 1
              ? "Enter your email to get started"
              : "Enter the OTP sent to your email"}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-gray-800 text-white border-2 border-gray-700 focus:border-cyan-400 rounded-lg px-4 py-3 mb-4 outline-none transition-colors"
              disabled={loading}
            />
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <div>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 bg-gray-800 text-white text-center text-xl font-bold border-2 border-gray-700 focus:border-cyan-400 rounded-lg outline-none transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mb-4"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-gray-400 text-sm">
                  Resend OTP in{" "}
                  <span className="text-cyan-400 font-bold">
                    {formatTime(countdown)}
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors disabled:text-gray-600"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;
