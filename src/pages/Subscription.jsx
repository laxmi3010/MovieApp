import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCrown,
  FaTimes,
  FaFilm,
  FaBolt,
  FaHeadset,
  FaDownload,
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaCircle,
  FaShieldAlt,
  FaStar,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import API_URL from "../config/api";


// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        background: "linear-gradient(135deg, #16a34a, #15803d)",
        color: "#fff",
        padding: "14px 20px",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(22,163,74,0.35)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: 600,
        fontSize: "15px",
        animation: "slideIn 0.4s ease",
        minWidth: "280px",
      }}
    >
      <FaCheckCircle size={20} />
      {message}
    </div>
  );
};

// ─── Plans ────────────────────────────────────────────────────────────────────
const NORMAL_PLANS = [
  {
    id: "weekly",
    label: "1 Week",
    price: 49,
    duration: 7,
    tag: "Try it out",
    perDay: "₹7/day",
    color: "#e11d48",
    features: ["Full HD streaming", "2 screens", "Basic support"],
  },
  {
    id: "monthly",
    label: "1 Month",
    price: 149,
    duration: 30,
    tag: "Most Popular",
    perDay: "₹5/day",
    color: "#dc2626",
    popular: true,
    features: ["4K Ultra HD", "4 screens", "Priority support", "Downloads"],
  },
  {
    id: "quarterly",
    label: "3 Months",
    price: 349,
    duration: 90,
    tag: "Best Value",
    perDay: "₹3.9/day",
    color: "#b91c1c",
    features: ["4K Ultra HD", "6 screens", "24/7 VIP support", "Unlimited downloads", "Early access"],
  },
];

const CHURN_PLANS = [
  {
    id: "weekly",
    label: "1 Week",
    price: 39,
    originalPrice: 49,
    duration: 7,
    tag: "Welcome Back",
    perDay: "₹5.6/day",
    color: "#e11d48",
    features: ["Full HD streaming", "2 screens", "Basic support"],
  },
  {
    id: "monthly",
    label: "1 Month",
    price: 99,
    originalPrice: 149,
    duration: 30,
    tag: "Most Popular",
    perDay: "₹3.3/day",
    color: "#dc2626",
    popular: true,
    features: ["4K Ultra HD", "4 screens", "Priority support", "Downloads"],
  },
  {
    id: "quarterly",
    label: "3 Months",
    price: 149,
    originalPrice: 349,
    duration: 90,
    tag: "Best Deal",
    perDay: "₹1.7/day",
    color: "#b91c1c",
    features: ["4K Ultra HD", "6 screens", "24/7 VIP support", "Unlimited downloads", "Early access"],
  },
];

// ─── Upsell Modal ─────────────────────────────────────────────────────────────
const UpsellModal = ({ onClose, isChurn }) => {
  const normalPerks = [
    { icon: <FaFilm />, text: "10,000+ movies & web series in Full HD & 4K" },
    { icon: <FaBolt />, text: "Zero ads. Pure, uninterrupted viewing." },
    { icon: <FaDownload />, text: "Download & watch offline on any device" },
    { icon: <FaHeadset />, text: "Dedicated premium support, always on" },
  ];

  const churnPerks = [
    { icon: <FaBolt />, text: "Exclusive members-only content drops every week" },
    { icon: <FaFilm />, text: "Early access to new releases before anyone else" },
    { icon: <FaDownload />, text: "Unlimited offline downloads across all devices" },
    { icon: <FaHeadset />, text: "Priority VIP support — skip the queue, always" },
    { icon: <FaStar />, text: "AI-powered personalised watchlists just for you" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg, #18181b 60%, #1c1917 100%)",
          border: "1px solid #3f3f46",
          borderRadius: "20px",
          padding: "40px 36px",
          maxWidth: "480px",
          width: "100%",
          position: "relative",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "#3f3f46",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#a1a1aa",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#52525b")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3f3f46")}
        >
          <FaTimes size={14} />
        </button>

        {/* Crown icon */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: isChurn
                ? "linear-gradient(135deg, #d97706, #92400e)"
                : "linear-gradient(135deg, #dc2626, #7f1d1d)",
              marginBottom: "16px",
              boxShadow: isChurn
                ? "0 0 30px rgba(217,119,6,0.45)"
                : "0 0 30px rgba(220,38,38,0.4)",
            }}
          >
            <FaCrown size={28} color="#fbbf24" />
          </div>

          {isChurn ? (
            <>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#d9770620",
                  border: "1px solid #d9770650",
                  color: "#fbbf24",
                  padding: "3px 12px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 700,
                  marginBottom: "10px",
                  letterSpacing: "0.06em",
                }}
              >
                🎁 EXCLUSIVE RETURNING MEMBER OFFER
              </div>
              <h2 style={{ color: "#fff", fontSize: "21px", fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3 }}>
                We've Saved Your Spot — and a Special Price
              </h2>
              <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
                Get <span style={{ color: "#fbbf24", fontWeight: 600 }}>more features & services</span> at a{" "}
                <span style={{ color: "#dc2626", fontWeight: 600 }}>low discounted price</span>, crafted just for you.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: "0 0 8px" }}>
                Get Personalised Assistance &amp; Care
              </h2>
              <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
                at a <span style={{ color: "#dc2626", fontWeight: 600 }}>low price</span>. Select your premium subscription below.
              </p>
            </>
          )}
        </div>

        {/* Perks */}
        <div style={{ marginBottom: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {(isChurn ? churnPerks : normalPerks).map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  background: isChurn ? "#d9770620" : "#dc262620",
                  color: isChurn ? "#fbbf24" : "#dc2626",
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </div>
              <span style={{ color: "#d4d4d8", fontSize: "14px" }}>{p.text}</span>
            </div>
          ))}
        </div>

        {/* Stars */}
        <div
          style={{
            background: "#27272a",
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "2px" }}>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color="#fbbf24" size={13} />
            ))}
          </div>
          <span style={{ color: "#a1a1aa", fontSize: "13px" }}>
            Rated <strong style={{ color: "#fff" }}>4.9/5</strong> by 2M+ subscribers
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: isChurn
              ? "linear-gradient(135deg, #d97706, #b45309)"
              : "linear-gradient(135deg, #dc2626, #b91c1c)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: isChurn
              ? "0 4px 20px rgba(217,119,6,0.4)"
              : "0 4px 20px rgba(220,38,38,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {isChurn ? "Claim My Discount →" : "Choose My Plan →"}
        </button>
        <p style={{ color: "#52525b", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
          {isChurn ? "Limited-time offer. Prices may go up anytime." : "Cancel anytime. No hidden charges."}
        </p>
      </div>
    </div>
  );
};

// ─── Payment Checklist ────────────────────────────────────────────────────────
const STEPS = [
  "Validating card details",
  "Authenticating with bank",
  "Processing payment",
  "Confirming subscription",
  "Activating your account",
];

const PaymentProcessing = ({ onDone }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      setTimeout(onDone, 600);
      return;
    }
    const delay = 700 + Math.random() * 600;
    const t = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [currentStep, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "#18181b",
          border: "1px solid #3f3f46",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #dc2626, #7f1d1d)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px",
              boxShadow: "0 0 24px rgba(220,38,38,0.4)",
            }}
          >
            <FaShieldAlt color="#fff" size={22} />
          </div>
          <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: "0 0 6px" }}>
            Secure Payment Processing
          </h3>
          <p style={{ color: "#71717a", fontSize: "13px", margin: 0 }}>
            Please do not close this window
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
          {STEPS.map((step, i) => {
            const done = completedSteps.includes(i);
            const active = currentStep === i;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flexShrink: 0 }}>
                  {done ? (
                    <FaCheckCircle color="#16a34a" size={20} />
                  ) : active ? (
                    <FaSpinner
                      color="#dc2626"
                      size={20}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <FaCircle color="#3f3f46" size={20} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color: done ? "#a1a1aa" : active ? "#fff" : "#52525b",
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.3s",
                  }}
                >
                  {step}
                </span>
                {done && (
                  <span style={{ marginLeft: "auto", color: "#16a34a", fontSize: "12px", fontWeight: 600 }}>
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          style={{
            background: "#27272a",
            borderRadius: "999px",
            height: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(completedSteps.length / STEPS.length) * 100}%`,
              background: "linear-gradient(90deg, #dc2626, #ef4444)",
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <p style={{ color: "#52525b", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
          {completedSteps.length} of {STEPS.length} steps completed
        </p>
      </div>
    </div>
  );
};

// ─── Main Subscription Page ───────────────────────────────────────────────────
const Subscription = () => {
  const navigate = useNavigate();

  // Read churn flag from sessionStorage
  const isChurn = sessionStorage.getItem("churn_detected") === "true";
  const PLANS = isChurn ? CHURN_PLANS : NORMAL_PLANS;

  const [showModal, setShowModal] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  // Card form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState(""); // visa / mastercard / rupay

  // Card number formatting
  const handleCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (digits.startsWith("4")) setCardType("visa");
    else if (digits.startsWith("5") || digits.startsWith("2")) setCardType("mastercard");
    else if (digits.startsWith("6")) setCardType("rupay");
    else setCardType("");
  };

  const handleExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) setExpiry(digits.slice(0, 2) + "/" + digits.slice(2));
    else setExpiry(digits);
  };

  const validateForm = () => {
    if (!cardName.trim()) return "Cardholder name is required";
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) return "Enter a valid 16-digit card number";
    if (expiry.length !== 5) return "Enter a valid expiry date (MM/YY)";
    if (cvv.length < 3) return "Enter a valid CVV";
    return null;
  };

  const handlePayment = async () => {
    const err = validateForm();
    if (err) { setError(err); return; }
    setError("");
    setProcessing(true);
  };

  const handleProcessingDone = async () => {
    try {
      await fetch(`${API_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ duration_of_subscription: selectedPlan.duration }),
      });
    } catch (_) {
      // silently continue — dummy flow
    } finally {
      setProcessing(false);
      sessionStorage.setItem("premium_member", "true");
      setToast("🎉 Subscription activated! Welcome to Premium.");
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        color: "#fff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        * { box-sizing: border-box; }
        input::placeholder { color: #52525b; }
        input:focus { outline: none; }
      `}</style>

      {/* Upsell Modal */}
      {showModal && <UpsellModal onClose={() => setShowModal(false)} isChurn={isChurn} />}

      {/* Payment Processing Overlay */}
      {processing && <PaymentProcessing onDone={handleProcessingDone} />}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #27272a",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#18181b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaFilm color="#dc2626" size={22} />
          <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Cine<span style={{ color: "#dc2626" }}>Max</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#71717a", fontSize: "13px" }}>
          <FaShieldAlt color="#16a34a" size={14} />
          256-bit SSL Secured
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 24px",
          animation: "fadeUp 0.5s ease",
        }}
      >
        {/* Page heading */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: isChurn ? "#d9770615" : "#dc262615",
              border: `1px solid ${isChurn ? "#d9770640" : "#dc262640"}`,
              color: isChurn ? "#fbbf24" : "#dc2626",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "14px",
            }}
          >
            <FaCrown size={12} color="#fbbf24" />
            {isChurn ? "Exclusive Welcome-Back Offer" : "Premium Membership"}
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-1px" }}>
            {isChurn ? "Your Discount is Waiting" : "Choose Your Plan"}
          </h1>
          <p style={{ color: "#71717a", fontSize: "16px", margin: 0 }}>
            {isChurn
              ? "Special prices, just for you. Offer expires soon — grab it before it's gone."
              : "Unlock unlimited entertainment. Cancel anytime."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
          {/* LEFT — Plan Selector */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#a1a1aa", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Select Plan
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              {PLANS.map((plan) => {
                const selected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      border: `2px solid ${selected ? "#dc2626" : "#27272a"}`,
                      borderRadius: "14px",
                      padding: "18px 20px",
                      cursor: "pointer",
                      background: selected ? "#dc262612" : "#18181b",
                      transition: "all 0.2s",
                      position: "relative",
                    }}
                  >
                    {plan.popular && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          left: "20px",
                          background: "#dc2626",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 10px",
                          borderRadius: "999px",
                        }}
                      >
                        MOST POPULAR
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: `2px solid ${selected ? "#dc2626" : "#52525b"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {selected && (
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#dc2626" }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "16px" }}>{plan.label}</div>
                          <div style={{ color: "#71717a", fontSize: "12px" }}>{plan.perDay}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {isChurn && plan.originalPrice && (
                          <div style={{ fontSize: "13px", color: "#52525b", textDecoration: "line-through", marginBottom: "2px" }}>
                            ₹{plan.originalPrice}
                          </div>
                        )}
                        <div style={{ fontSize: "22px", fontWeight: 800, color: selected ? "#fff" : "#a1a1aa" }}>
                          ₹{plan.price}
                        </div>
                        <div style={{ color: isChurn ? "#fbbf24" : "#52525b", fontSize: "11px", fontWeight: isChurn ? 600 : 400 }}>
                          {plan.tag}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {plan.features.map((f, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#27272a",
                            color: "#a1a1aa",
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "999px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FaCheck size={8} color="#16a34a" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security badges */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {["PCI DSS Compliant", "256-bit Encryption", "RBI Authorised"].map((b) => (
                <div
                  key={b}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    fontSize: "11px",
                    color: "#71717a",
                  }}
                >
                  <MdVerified color="#16a34a" size={13} />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Payment Form */}
          <div
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Order summary */}
            <div
              style={{
                background: "#27272a",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "#71717a" }}>Order Summary</div>
                <div style={{ fontWeight: 700, fontSize: "16px" }}>
                  Movie {selectedPlan.label} Plan
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#dc2626" }}>₹{selectedPlan.price}</div>
                <div style={{ fontSize: "11px", color: "#52525b" }}>incl. all taxes</div>
              </div>
            </div>

            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaCreditCard color="#dc2626" /> Payment Details
            </h2>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "#dc262615",
                  border: "1px solid #dc2626",
                  color: "#f87171",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </div>
            )}

            {/* Card visual */}
            <div
              style={{
                background: "linear-gradient(135deg, #1c1917 0%, #27272a 50%, #1c1917 100%)",
                border: "1px solid #3f3f46",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "#dc262620" }} />
              <div style={{ position: "absolute", bottom: "-30px", left: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "#dc262215" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#52525b" }} />
                  ))}
                </div>
                <div style={{ color: "#71717a", fontSize: "12px", fontWeight: 600 }}>
                  {cardType === "visa" && "VISA"}
                  {cardType === "mastercard" && "MASTERCARD"}
                  {cardType === "rupay" && "RuPay"}
                  {!cardType && "CARD"}
                </div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "17px", letterSpacing: "3px", color: cardNumber ? "#fff" : "#52525b", marginBottom: "14px" }}>
                {cardNumber || "•••• •••• •••• ••••"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#52525b", marginBottom: "2px" }}>CARD HOLDER</div>
                  <div style={{ fontSize: "13px", color: cardName ? "#fff" : "#52525b", fontWeight: 600 }}>
                    {cardName.toUpperCase() || "YOUR NAME"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "#52525b", marginBottom: "2px" }}>EXPIRES</div>
                  <div style={{ fontSize: "13px", color: expiry ? "#fff" : "#52525b", fontFamily: "monospace" }}>
                    {expiry || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Cardholder Name */}
              <div>
                <label style={{ fontSize: "12px", color: "#71717a", display: "block", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="As printed on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#27272a",
                    border: "1px solid #3f3f46",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
                />
              </div>

              {/* Card Number */}
              <div>
                <label style={{ fontSize: "12px", color: "#71717a", display: "block", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Card Number
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => handleCardNumber(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#27272a",
                      border: "1px solid #3f3f46",
                      borderRadius: "10px",
                      padding: "12px 44px 12px 14px",
                      color: "#fff",
                      fontSize: "14px",
                      fontFamily: "monospace",
                      letterSpacing: "2px",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                    onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
                  />
                  <FaCreditCard
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}
                    color="#52525b"
                    size={16}
                  />
                </div>
              </div>

              {/* Expiry + CVV */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#71717a", display: "block", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => handleExpiry(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#27272a",
                      border: "1px solid #3f3f46",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      color: "#fff",
                      fontSize: "14px",
                      fontFamily: "monospace",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                    onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#71717a", display: "block", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    CVV
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cvv}
                      maxLength={4}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      style={{
                        width: "100%",
                        background: "#27272a",
                        border: "1px solid #3f3f46",
                        borderRadius: "10px",
                        padding: "12px 40px 12px 14px",
                        color: "#fff",
                        fontSize: "14px",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                      onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
                    />
                    <FaLock style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }} color="#52525b" size={13} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              style={{
                width: "100%",
                marginTop: "24px",
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 4px 20px rgba(220,38,38,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(220,38,38,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(220,38,38,0.35)";
              }}
            >
              <FaLock size={14} />
              Pay ₹{selectedPlan.price} Securely
            </button>

            <p style={{ color: "#52525b", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
              Your card details are encrypted and never stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;