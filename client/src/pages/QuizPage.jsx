import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import LeaderboardAndStats from "../components/LeaderboardAndStats";
import Navbar from "../components/Navbar";
import QRCode from "react-qr-code";

const socket = io("http://localhost:3000");

function calculateScore(timeRemaining) {
  if (timeRemaining < 0) timeRemaining = 0;
  if (timeRemaining > 100) timeRemaining = 100;

  const a = -0.008;
  const b = 0.88;
  const c = 20;

  const score = a * Math.pow(timeRemaining, 2) + b * timeRemaining + c;

  return Math.round(score);
}

const getMedalEmoji = (position) => {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return `#${position}`;
};

const QuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [status, setStatus] = useState("loading");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const localUser = localStorage.getItem("qzuser");
  const [showQuestions, setShowQuestion] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [myScore, setMyScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quiz/${quizId}`);
        const quizData = response.data;
        setIsCreator(localUser === quizData.creator);
        setQuiz(quizData);
        setStatus(quizData.status);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        setStatus("error");
      }
    };

    fetchQuiz();
  }, [quizId, status]);

  useEffect(() => {
    socket.emit("joinQuiz", quizId, localUser);

    socket.on("ucount", (uc) => {
      setUserCount(uc);
    });

    socket.on("quizStarted", () => {
      setStatus("live");
    });

    socket.on("question", (question, index) => {
      console.log("question received");
      setShowQuestion(true);
      setCurrentQuestion(question);
      setQuestionIndex(index);
      setTimeRemaining(question.time);
      setSelectedAnswer(null);
    });

    socket.on("timeRemaining", (time) => {
      setTimeRemaining(time);
    });

    socket.on("leaderboard", (newLeaderboard, stats) => {
      setShowQuestion(false);
      setStats(stats);
      setLeaderboard(newLeaderboard);
      const mysc = newLeaderboard.filter(
        (player) => player.username === localUser
      );
      setMyScore(mysc[0].score);
    });

    socket.on("quizClosed", () => {
      setStatus("closed");
    });

    return () => {
      socket.emit("leaveQuiz", quizId, localUser);
      socket.off("quizStarted");
      socket.off("question");
      socket.off("timeRemaining");
      socket.off("leaderboard");
      socket.off("quizClosed");
    };
  }, [quizId]);

  const handleStartQuiz = async () => {
    console.log("start quiz button ppressed");
    await axios.post(`/api/quiz/${quizId}/start`);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const score = calculateScore(timeRemaining);
    socket.emit(
      "submitAnswer",
      quizId,
      localUser,
      questionIndex,
      answer,
      score
    );
  };

  if (status === "loading") {
    return (
      <p className="text-center text-sm md:text-lg text-gray-700">
        Loading quiz details...
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-sm md:text-lg text-red-600">
        Failed to load quiz. Please try again later.
      </p>
    );
  }

  return (
    <div className="mt-[100px]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        {status === "open" && (
          <div className="text-center mb-6 flex flex-col items-center gap-10">
            {isCreator ? (
              <div className="flex flex-col gap-6 w-full max-w-md">
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2 bg-[#6D56C8] text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Start Quiz
                </button>
                <span className="text-lg md:text-xl text-zinc-900">
                  Room code:
                  <span className="text-xl md:text-3xl"> {quizId}</span>
                </span>
                <QRCode
                  size={200}
                  className="w-full"
                  value={`http://localhost:5173/quiz/${quizId}`}
                />
              </div>
            ) : (
              <p className="text-lg text-gray-500">
                Quiz will start soon. Please wait for the host to begin.
                <img src="/wait.gif" alt="Waiting" className="w-32 mx-auto" />
              </p>
            )}
            <span className="text-sm md:text-lg">{userCount} Users joined</span>
          </div>
        )}

        {status === "live" && currentQuestion && showQuestions && (
          <div className="text-center px-4">
            <div className="flex flex-wrap gap-6 items-center justify-center text-sm md:text-lg mb-4">
              <span>{localUser}</span>
              <span>{myScore}</span>
            </div>
            <p className="text-lg md:text-xl font-semibold mb-4">
              Question {questionIndex + 1}: {currentQuestion.question}
            </p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-4 bg-[#6D56C8] progress"
                style={{
                  width: `${(timeRemaining / currentQuestion.time) * 100}%`,
                  transition: "width 1s linear",
                }}
              ></div>
            </div>
            <ul className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleAnswer(option)}
                    className={`w-full px-4 py-2 text-left rounded-lg focus:outline-none text-sm md:text-base ${
                      selectedAnswer === null
                        ? "bg-gray-100 hover:bg-gray-200"
                        : selectedAnswer === option
                        ? "bg-[#6D56C8] cursor-not-allowed text-white"
                        : "cursor-not-allowed"
                    }`}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {status === "live" && !showQuestions && (
          <div className="text-center mt-6">
            <LeaderboardAndStats leaderboard={leaderboard} stats={stats} />
          </div>
        )}

        {status === "closed" && (
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              Final Leaderboard
            </h2>
            <ul className="space-y-3">
              {quiz.leaderboard.map((player, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-sm md:text-md font-medium text-gray-800 bg-gray-100 py-2 px-4 rounded-lg shadow-md"
                >
                  <span>
                    {getMedalEmoji(index + 1)} {player.username}
                  </span>
                  <span>{player.score} points</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
