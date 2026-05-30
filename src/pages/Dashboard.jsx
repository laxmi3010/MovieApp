import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCrown,
  FaStar,
  FaPlay,
  FaSpinner,
  FaThumbsUp,
  FaFire,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Horizontalscrollcard from "../components/Horizontalscrollcard";

import API_URL from "../config/api";

// ─── Inline ActivityHeatmap Component ───────────────────────────────────────

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getColor = (count) => {
  if (!count || count === 0) return null;
  if (count === 1) return "#164e63";
  if (count === 2) return "#0e7490";
  if (count <= 4) return "#06b6d4";
  return "#67e8f9";
};

const formatDate = (year, month, day) => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}/${mm}/${dd}`;
};

const ActivityHeatmap = ({ heatmapData = [] }) => {
  const [tooltip, setTooltip] = useState(null);

  const countMap = {};
  heatmapData.forEach(({ date, count }) => {
    countMap[date] = count;
  });

  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const buildGrid = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = new Date(year, month, 1).getDay();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  return (
    <div className="relative select-none">
      {/* Single horizontal scrollable row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        {months.map(({ year, month }) => {
          const cells = buildGrid(year, month);
          return (
            <div key={`${year}-${month}`} style={{ flexShrink: 0 }}>
              {/* Centered month + year label */}
              <p
                style={{
                  color: "#06b6d4",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                  textAlign: "center",
                }}
              >
                {MONTH_NAMES[month]} {year}
              </p>

              {/* Day cells */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 12px)",
                  gap: "3px",
                }}
              >
                {cells.map((day, idx) => {
                  if (day === null) {
                    return <div key={idx} style={{ width: 12, height: 12 }} />;
                  }

                  const dateStr = formatDate(year, month, day);
                  const count = countMap[dateStr] || 0;
                  const color = getColor(count);
                  const isToday =
                    year === now.getFullYear() &&
                    month === now.getMonth() &&
                    day === now.getDate();

                  return (
                    <div
                      key={idx}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const parentRect = e.currentTarget
                          .closest(".relative")
                          ?.getBoundingClientRect() || { left: 0, top: 0 };
                        setTooltip({
                          x: rect.left - parentRect.left - 160,
                          y: rect.top - parentRect.top - 14,
                          date: dateStr.replaceAll("/", "-"),
                          count,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        setTooltip(null);
                      }}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        cursor: "default",
                        backgroundColor: color || "transparent",
                        border: color
                          ? "none"
                          : `1px solid ${isToday ? "#06b6d4" : "#374151"}`,
                        boxSizing: "border-box",
                        transition: "transform 0.1s",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: "#111827",
            border: "1px solid #06b6d4",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 11,
            color: "#e5e7eb",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 50,
            boxShadow: "0 0 8px rgba(6,182,212,0.3)",
          }}
        >
          <span style={{ color: "#06b6d4", fontWeight: 600 }}>
            {tooltip.date}
          </span>
          {"  ·  "}
          {tooltip.count > 0
            ? `${tooltip.count} movie${tooltip.count > 1 ? "s" : ""} watched`
            : "No activity"}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 16,
          justifyContent: "flex-end",
        }}
      >
        <span style={{ fontSize: 10, color: "#6b7280" }}>Less</span>
        {[null, "#164e63", "#0e7490", "#06b6d4", "#67e8f9"].map((c, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: c || "transparent",
              border: c ? "none" : "1px solid #374151",
            }}
          />
        ))}
        <span style={{ fontSize: 10, color: "#6b7280" }}>More</span>
      </div>
    </div>
  );
};

// ─── Dashboard Component ─────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("profile_name");
  const [isPremium, setIsPremium] = useState(false);
  const [scorePoints, setScorePoints] = useState(0);
  const [continueWatching, setContinueWatching] = useState([]);
  const [detailedMovies, setDetailedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [showModal, setShowModal] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  // ── NEW: state for recommended movies ──
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch(`${API_URL}/subscriptions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);

        if (data.is_premium_member) {
          setIsPremium(true);
          setScorePoints(data.score || 0);
          setContinueWatching(data.watched_movies || []);

          const rawData = data.heatmap_data || [];
          const formatted = rawData.map((item) => ({
            date: item.date.replaceAll("-", "/"),
            count: item.frequency,
          }));
          setHeatmapData(formatted);
          setMaxStreak(data.max_streak || 0);

          // ── Fetch continue watching details ──
          if (data.watched_movies && data.watched_movies.length > 0) {
            console.log(data.watched_movies);
            const detailPromises = data.watched_movies.map(async (movie) => {
              try {
                const apiKey = import.meta.env.VITE_TMDB_API_KEY;
                const baseUrl = "https://api.themoviedb.org/3";
                const endpoint = `/${movie.explore}/${movie.explore_id}`;
                const res = await fetch(
                  `${baseUrl}${endpoint}?api_key=${apiKey}`,
                );
                const movieDetail = await res.json();
                if (!movieDetail.media_type) {
                  return { ...movieDetail, media_type: movie.explore };
                }
                return movieDetail;
              } catch (error) {
                console.error(
                  `Error fetching detail for ${movie.explore_id}:`,
                  error,
                );
                return null;
              }
            });

            const allDetails = await Promise.all(detailPromises);
            setDetailedMovies(allDetails.filter((detail) => detail !== null));
          }

          // ── NEW: Fetch recommendations ──
          // For each item in data.recommendation, call /{explore}/{explore_id}/recommendations
          // Merge all results, deduplicate by id, and keep first 5
          if (data.recommendation && data.recommendation.length > 0) {
            const apiKey = import.meta.env.VITE_TMDB_API_KEY;
            const baseUrl = "https://api.themoviedb.org/3";

            const recommendationPromises = data.recommendation.map(
              async (item) => {
                try {
                  const res = await fetch(
                    `${baseUrl}/${item.explore}/${item.explore_id}/recommendations?api_key=${apiKey}`,
                  );
                  const recData = await res.json();
                  // Each result item may lack media_type — attach it from the source explore field
                  // Take up to 5 results per recommendation item
                  const results = (recData.results || [])
                    .slice(0, 5)
                    .map((movie) => ({
                      ...movie,
                      media_type: movie.media_type || item.explore,
                    }));
                  return results;
                } catch (error) {
                  console.error(
                    `Error fetching recommendations for ${item.explore_id}:`,
                    error,
                  );
                  return [];
                }
              },
            );

            const allRecommendationArrays = await Promise.all(
              recommendationPromises,
            );

            // Flatten all arrays into one list
            const merged = allRecommendationArrays.flat();

            // Deduplicate by movie id
            const seen = new Set();
            const deduplicated = merged.filter((movie) => {
              if (seen.has(movie.id)) return false;
              seen.add(movie.id);
              return true;
            });

            // Keep all deduplicated results (up to 5 per source = max 15 for 3 items)
            setRecommendedMovies(deduplicated);
          }
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  console.log(detailedMovies);
  console.log("Recommended Movies:", recommendedMovies);

  if (loading) {
    return (
      <div className="min-h-screen mt-12 bg-black text-white flex items-center justify-center">
        <FaSpinner className="text-cyan-400 text-5xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-12 bg-black text-white p-6 md:p-8">
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

      {/* Greeting Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
          Hi, {username}
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Welcome back! Ready to continue your movie journey?
        </p>
      </div>

      {/* Activity Heatmap - Premium Only */}
      {isPremium && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cyan-400">
              Watching Activity
            </h2>
            <div className="flex items-center gap-2 bg-black/40 border border-cyan-800/60 rounded-xl px-4 py-2">
              <FaFire className="text-orange-400 text-sm" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                Max Streak
              </span>
              <span className="text-lg font-extrabold text-white">
                {maxStreak}
              </span>
              <span className="text-xs text-cyan-400/60">days</span>
            </div>
          </div>
          <ActivityHeatmap heatmapData={heatmapData} />
        </div>
      )}

      {/* Recommended for You Section - Premium Only */}
      {isPremium && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaThumbsUp className="text-cyan-400 text-2xl" />
            <h2 className="text-2xl font-bold text-white">
              Recommended for You
            </h2>
          </div>
          <div className="bg-gray-900 rounded-lg p-8 border-2 border-gray-800 min-h-[300px] flex items-center justify-center">
            {recommendedMovies.length > 0 ? (
              <Horizontalscrollcard data={recommendedMovies} />
            ) : (
              <p className="text-gray-600 text-sm">
                No recommendations available yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Membership Section */}
      <div className="mb-8">
        {isPremium ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900 rounded-2xl border border-cyan-800 shadow-xl shadow-cyan-900/40">
            {/* Decorative glow blobs */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div className="relative p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left — Crown + badge + subtitle */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/30">
                  <FaCrown className="text-yellow-400 text-2xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      Premium Member
                    </h2>
                    <span className="text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-cyan-400/70 text-sm mt-0.5">
                    Enjoy unlimited access to all features
                  </p>
                </div>
              </div>

              {/* Right — Score + Earn button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Score display */}
                <div className="flex flex-col items-center bg-black/40 border border-cyan-800/60 rounded-xl px-6 py-3 min-w-[110px]">
                  <span className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Your Score
                  </span>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400 text-lg" />
                    <span className="text-3xl font-extrabold text-white leading-none">
                      {scorePoints}
                    </span>
                  </div>
                  <span className="text-xs text-cyan-400/60 mt-1">points</span>
                </div>

                {/* Earn More button */}
                <button
                  onClick={() => navigate("/quiz")}
                  className="group relative flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-700/40"
                >
                  <FaStar className="text-yellow-300 group-hover:rotate-12 transition-transform duration-300" />
                  Earn More Score
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Unlock Premium Features
                </h2>
                <p className="text-gray-400 text-sm">
                  Get unlimited access, exclusive content, and more!
                </p>
              </div>
              <button
                onClick={() => navigate("/subscription")}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaCrown className="text-yellow-400" />
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Continue Watching Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaPlay className="text-cyan-400 text-2xl" />
          <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
        </div>
        <div className="bg-gray-900 rounded-lg p-8 border-2 border-gray-800 min-h-[300px] flex items-center justify-center">
          {isPremium ? (
            detailedMovies.length > 0 ? (
              <Horizontalscrollcard data={detailedMovies} />
            ) : (
              <div className="text-center">
                <FaPlay className="text-gray-600 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No data available</p>
              </div>
            )
          ) : (
            <div className="text-center">
              <FaCrown className="text-gray-600 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-3">
                Upgrade to Premium Membership
              </p>
              <p className="text-gray-600 text-sm">to unlock this feature</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
