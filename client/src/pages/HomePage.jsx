import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-200">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to Quiz Master
        </h1>
        <p className="text-lg text-gray-400">
          Create and join live quizzes seamlessly!
        </p>
      </div>

      <div className="flex space-x-8">
        {/* Create Quiz Button */}
        <button className="px-6 py-4 text-xl font-semibold bg-gray-800 text-purple-400 rounded-lg shadow-lg hover:bg-purple-600 hover:text-white transition-all duration-300">
          Create Quiz
        </button>

        {/* Join Quiz Button */}
        <button className="px-6 py-4 text-xl font-semibold bg-gray-800 text-blue-400 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
          Join Quiz
        </button>
      </div>
    </div>
  );
};

export default HomePage;
