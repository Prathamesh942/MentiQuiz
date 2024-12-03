import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Groq from "groq-sdk";

const QuizCreator = () => {
  const qzUser = localStorage.getItem("qzuser");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "", time: 30 },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [defaultTime, setDefaultTime] = useState(20);
  const navigate = useNavigate();

  const handleQuestionChange = (e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].options[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].answer =
      updatedQuestions[currentQuestion].options[index];
    setQuestions(updatedQuestions);
  };

  const handleTimeChange = (value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].time = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    if (questions.length >= 15) {
      alert("You cannot add more than 15 questions.");
      return;
    }
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "", time: 30 },
    ]);
    setCurrentQuestion(questions.length);
  };

  const deleteQuestion = () => {
    if (questions.length === 1) {
      alert("You must have at least one question.");
      return;
    }
    const updatedQuestions = questions.filter(
      (_, index) => index !== currentQuestion
    );
    setQuestions(updatedQuestions);
    setCurrentQuestion((prev) =>
      prev === updatedQuestions.length ? prev - 1 : prev
    );
  };

  const selectQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const fetchAiQuestions = async () => {
    try {
      console.log(aiPrompt, numQuestions, defaultTime);

      const response = await axios.get("/api/generate-quiz", {
        params: {
          prompt: aiPrompt,
          numQuestions: numQuestions,
          time: defaultTime,
        },
      });
      setQuestions(response.data);
      console.log("AI-generated questions added successfully!", response.data);
    } catch (error) {
      console.error("Error generating AI questions:", error);
      alert("Failed to generate AI questions.");
    }
  };

  const handleSubmit = async () => {
    const quizData = {
      creator: qzUser,
      questions: questions.map((question) => ({
        question: question.question,
        options: question.options,
        answer: question.answer,
        time: question.time,
      })),
    };
    console.log("submit button pressed");

    try {
      const response = await axios.post("/api/v1/quiz", quizData);
      const quizId = response.data.roomId;
      alert("Quiz submitted successfully!");
      navigate(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex flex-col items-center py-8 md:flex-row md:justify-between gap-10">
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full px-6 md:px-[6vw] mt-4 md:mt-[20px] pt-[20px]">
        {/* Left Section */}
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl mb-6 flex-1">
          <h2 className="text-lg md:text-xl font-bold mb-4 flex gap-2 justify-center items-center">
            Generate Questions with AI
            <img src="/ai.png" alt="AI Icon" className="w-10 md:w-[50px]" />
          </h2>

          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Enter a prompt for AI to generate questions"
            className="w-full p-4 rounded-lg bg-[#F8F9FA] text-black focus:outline-none focus:ring-2 focus:ring-[#6D56C8] mb-4"
          />

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex flex-col w-full md:w-auto">
              <label
                htmlFor="numQuestions"
                className="text-sm font-medium mb-1"
              >
                Number of Questions
              </label>
              <input
                id="numQuestions"
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                placeholder="Number of Questions"
                className="p-2 rounded-lg bg-[#F8F9FA] text-black focus:outline-none focus:ring-2 focus:ring-[#6D56C8]"
              />
            </div>

            <div className="flex flex-col w-full md:w-auto">
              <label htmlFor="defaultTime" className="text-sm font-medium mb-1">
                Time
              </label>
              <input
                id="defaultTime"
                type="number"
                value={defaultTime}
                onChange={(e) => setDefaultTime(e.target.value)}
                placeholder="Default Time (seconds)"
                className="p-2 rounded-lg bg-[#F8F9FA] text-black focus:outline-none focus:ring-2 focus:ring-[#6D56C8]"
              />
            </div>
          </div>

          <button
            onClick={fetchAiQuestions}
            className="w-full md:w-auto bg-[#6D56C8] text-white px-4 py-2 rounded-lg hover:bg-[#5A49A3]"
          >
            Generate Questions
          </button>
        </div>

        {/* Right Section */}
        <div className="w-full flex flex-col items-center md:flex-[2]">
          <div className="flex space-x-2 md:space-x-4 mb-2 mt-4 flex-wrap">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => selectQuestion(index)}
                className={`w-8 h-8 flex items-center justify-center text-sm md:text-lg font-semibold rounded-full ${
                  currentQuestion === index
                    ? "bg-[#6D56C8] text-white"
                    : "bg-[#E0D7F0] text-[#6D56C8] hover:bg-[#D1C8F7]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={addQuestion}
            className="bg-[#E0D7F0] text-[#6D56C8] px-4 py-2 rounded-md hover:bg-[#D1C8F7] mb-4"
            disabled={questions.length >= 15}
          >
            Add Question
          </button>

          {/* Question Editing */}
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <textarea
              placeholder="Type your question here"
              value={questions[currentQuestion]?.question || ""}
              onChange={handleQuestionChange}
              className="w-full p-4 mb-4 rounded-lg bg-[#F8F9FA] text-black focus:outline-none focus:ring-2 focus:ring-[#6D56C8]"
            />
            <div>
              {questions[currentQuestion]?.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full p-4 rounded-lg bg-[#F8F9FA] text-black focus:outline-none focus:ring-2 focus:ring-[#6D56C8]"
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={
                      questions[currentQuestion]?.answer ===
                      questions[currentQuestion]?.options[index]
                    }
                    onChange={() => handleAnswerChange(index)}
                    className="h-5 w-5 text-[#6D56C8] focus:ring-2 focus:ring-[#6D56C8]"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <label className="flex items-center text-sm">
                <span>Time:</span>
                <input
                  type="number"
                  value={questions[currentQuestion]?.time || ""}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-16 p-2 rounded-lg bg-[#F8F9FA] text-black focus:outline-none focus:ring-2 focus:ring-[#6D56C8]"
                />
              </label>
              <button
                onClick={deleteQuestion}
                className="bg-[#FF5F56] text-white px-6 py-2 rounded-lg hover:bg-[#D7443C]"
              >
                Delete Question
              </button>
            </div>
          </div>

          <button
            className="bg-[#6D56C8] text-white p-4 rounded-lg mt-8 w-full hover:bg-[#5A49A3] max-w-2xl"
            onClick={handleSubmit}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
