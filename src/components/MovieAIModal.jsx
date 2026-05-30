import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import API_URL from "../config/api";


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const MovieAIModal = ({ isOpen, onClose, movieName, releaseDate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchMovieAIResponse();
    }
  }, [isOpen]);

  const fetchMovieAIResponse = async () => {
    setLoading(true);
    setError(false);
    setMovieData(null);

    try {
      const response = await fetch(`${API_URL}/movie-ai-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          movie_name: movieName,
          release_date: releaseDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setMovieData(data);
    } catch (err) {
      console.error(`Error : ${err}`)
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchMovieAIResponse();
  };

  // Hardcoded chart data (will be replaced with backend data)
  const getChartData = () => {
    // If backend provides box_office_data, use it
    if (movieData?.box_office_data) {
      return {
        labels: movieData.box_office_data.labels,
        datasets: [
          {
            label: "Box Office Revenue",
            data: movieData.box_office_data.revenues,
            borderColor: "#22d3ee",
            backgroundColor: "rgba(34, 211, 238, 0.1)",
            borderWidth: 3,
            pointBackgroundColor: "#22d3ee",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
          },
        ],
      };
    }

    // Hardcoded fallback data
    return {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      datasets: [
        {
          label: "Box Office Revenue",
          data: [15000000, 28000000, 35000000, 42000000, 38000000, 32000000],
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: "#22d3ee",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#22d3ee",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "#22d3ee",
        bodyColor: "#fff",
        borderColor: "#22d3ee",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#9ca3af",
          callback: function (value) {
            return "$" + (value / 1000000).toFixed(0) + "M";
          },
        },
        grid: {
          color: "rgba(34, 211, 238, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "rgba(34, 211, 238, 0.1)",
        },
      },
    },
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 bg-gray-900 rounded-2xl shadow-2xl shadow-cyan-400/20 border border-cyan-400/30 max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400 transition-colors duration-200 z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-8">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-2 border-4 border-transparent border-t-cyan-300 rounded-full animate-spin animation-delay-150"
                  style={{ animationDirection: "reverse" }}
                ></div>
              </div>
              <p className="mt-6 text-cyan-400 font-semibold text-lg animate-pulse">
                AI is analyzing the movie...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-400 font-semibold text-lg mb-4">
                Error occurred while generating AI response
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {movieData && !loading && !error && (
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">
                {movieData.movie_name}
              </h2>

              <div className="border-t border-cyan-400/30 pt-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                  AI Analysis
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {movieData.description}
                </p>
              </div>

              {/* Box Office Chart */}
              <div className="border-t border-cyan-400/30 pt-6 mt-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                  Box Office Revenue Over Time
                </h3>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-400/20">
                  <div style={{ height: "300px" }}>
                    <Line data={getChartData()} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieAIModal;
