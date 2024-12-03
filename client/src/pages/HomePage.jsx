import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Landing from "./Landing";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [roomId, setRoomId] = useState(""); // State for storing Room ID
  const navigate = useNavigate(); // For navigation
  const token = localStorage.getItem("authToken");
  if (!token) return <Landing />;
  // Handle Join Quiz
  const handleJoinQuiz = () => {
    // Validate room ID
    if (!/^\d{4}$/.test(roomId)) {
      alert("Please enter a valid 4-digit Room ID!");
      return;
    }

    // Logic to validate or handle Room ID (you can add a backend check here)
    navigate(`/quiz/${roomId}`); // Redirect to quiz room if valid
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-none  text-gray-200">
      <Navbar />
      <img
        src="/grad.png"
        className=" absolute w-[100%] h-[100%] object-cover"
        alt=""
      />

      <div className="flex  flex-col items-center z-20 bg-transparent  gap-[80px] ">
        <div className="flex gap-[20px] items-center bg-transparent  flex-col">
          <input
            type="text"
            placeholder="Enter 4-digit Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="p-[2px] bg-transparent border-b-2 outline-none  placeholder:text-white w-[40vw] text-center text-[15px] md:placeholder:text-[20px]"
            maxLength={4} // Optional: Limit input length to 4 characters
          />
          <button
            onClick={handleJoinQuiz}
            className=" text-black bg-white p-4 rounded-md px-8"
          >
            Join Quiz
          </button>
        </div>
        <Link to={"/create-quiz"} className=" bg-transparent ">
          <button className="px-6 py-4 border-white border text-white rounded-md">
            Create Quiz
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
