import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-wrap md:flex-nowrap justify-center items-center p-6 md:p-[6vw] mt-10 flex-col md:flex-row pt-[100px]">
        {/* Left Section */}
        <div className="flex flex-1 flex-col md:items-start gap-6 md:gap-[30px] items-center">
          <div className="flex flex-col justify-start items-start space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="text-[#6D56C8]">QuizUp</span>, Create a quiz to
              challenge your audience
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Make fun interactive quizzes to test your colleagues’ knowledge,
              run a quiz night with friends, or help students study.
            </p>
            <p className=" flex justify-center items-center gap-5 border bg-[#e9e4ff] rounded-md p-2">
              <span className=" font-bold text-[20px] md:text-[30px]">
                Powered by AI
              </span>
              <img src="/ailogo.png" alt="" className="w-10 md:w-20" />
            </p>
          </div>
          <Link to={"/auth"}>
            <button className="bg-[#6D56C8] px-6 py-3 rounded-md text-white hover:bg-[#5A49A3] text-sm md:text-base">
              Get Started
            </button>
          </Link>
        </div>
        {/* Right Section */}
        <div className="flex flex-1 justify-center mt-6 md:mt-0 items-center pr-[30px]">
          <img
            src="/hero.png"
            alt="Quiz Hero"
            className="w-full max-w-[400px] md:max-w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
