import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters, AiOutlineTrophy } from "react-icons/ai";
import QuestionCard from "../components/Questioncard";
import API_URL from "../config/api";


const Quiz = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${API_URL}/quiz`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setQuizData(data.quiz);
      setUsername(data.username);
      setLoading(false);
    } catch (err) {
      setError("Error while preparing Quiz for you. Try again after sometime");
      setLoading(false);
    }
  };

  const handleAnswerSelect = (selectedOption, correctAnswer) => {
    // Update score if correct
    if (selectedOption === correctAnswer) {
      setScore((prevScore) => prevScore + 5);
    }

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleFinishQuiz = async () => {
  
    try {
      await fetch(`${API_URL}/update-score`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          score: score,
        }),
      });
      navigate("/");
    } catch (err) {
      console.error("Error updating score:", err);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-16 bg-gradient-to-br from-black to-gray-900 flex justify-center items-center p-5">
        <div className="text-center text-cyan-400">
          <AiOutlineLoading3Quarters className="text-5xl mb-5 animate-spin mx-auto" />
          <p className="text-2xl font-medium">Preparing quiz for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-16 bg-gradient-to-br from-black to-gray-900 flex justify-center items-center p-5">
        <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-10 max-w-lg">
          <p className="text-red-500 text-lg text-center m-0">{error}</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen mt-16 bg-gradient-to-br from-black to-gray-900 flex justify-center items-center p-5">
        <div className="text-center bg-cyan-400/5 border-2 border-cyan-400 rounded-2xl px-20 py-16 shadow-[0_8px_32px_rgba(0,255,255,0.2)]">
          <AiOutlineTrophy className="text-8xl text-cyan-400 mb-5 mx-auto animate-bounce" />
          <h2 className="text-cyan-400 text-4xl mb-5 font-bold">
            Quiz Completed!
          </h2>
          <p className="text-white text-3xl mb-10 font-medium">
            You earned {score} points
          </p>
          <button
            className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-black border-none px-12 py-4 rounded-full text-lg font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,255,255,0.3)] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,255,255,0.5)] active:-translate-y-0.5"
            onClick={handleFinishQuiz}
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-black to-gray-900 flex justify-center items-center p-5 relative">
      <div className="absolute top-5 right-5 flex gap-5 items-center">
        <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-black px-6 py-3 rounded-full text-lg font-bold shadow-[0_4px_15px_rgba(0,255,255,0.3)]">
          Score: {score}
        </div>
        <div className="text-cyan-400 text-base font-medium">
          Question {currentQuestion + 1} of {quizData.length}
        </div>
      </div>
      <QuestionCard
        key={currentQuestion}
        question={quizData[currentQuestion].question}
        options={quizData[currentQuestion].options}
        correctAnswer={quizData[currentQuestion].correct_answer}
        onAnswerSelect={handleAnswerSelect}
      />
    </div>
  );
};

export default Quiz;
