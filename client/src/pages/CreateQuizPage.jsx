import React, { useState } from "react";

const CreateQuizPage = () => {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], timer: 30 },
  ]);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleTimerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].timer = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], timer: 30 },
    ]);
  };

  const handleSubmit = () => {
    console.log("Quiz Created:", questions);
    alert("Quiz Created Successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Quiz</h1>
      <div className="max-w-3xl mx-auto">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <label className="block text-lg font-semibold mb-3">
              Question {qIndex + 1}
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                placeholder="Enter your question"
                className="w-full mt-2 p-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </label>

            <div className="space-y-4">
              {q.options.map((option, optIndex) => (
                <label key={optIndex} className="block">
                  Option {optIndex + 1}
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    placeholder={`Enter option ${optIndex + 1}`}
                    className="w-full mt-2 p-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </label>
              ))}
            </div>

            <label className="block mt-4">
              Timer (in seconds)
              <input
                type="number"
                value={q.timer}
                onChange={(e) => handleTimerChange(qIndex, e.target.value)}
                placeholder="Enter time limit"
                className="w-full mt-2 p-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </label>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={addQuestion}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Add Question
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
