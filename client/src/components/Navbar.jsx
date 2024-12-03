import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = localStorage.getItem("qzuser");
  const navigate = useNavigate();
  return (
    <div className=" w-[100%] px-[6vw] h-[70px] border-b-2 flex justify-between  items-center absolute z-20 top-0  bg-[#ffffff4a] ">
      <Link to={"/"}>
        <img className="w-[100px] " src="/logo.png" alt="" />
      </Link>
      <div className=" flex gap-10 items-center">
        {user ? (
          <>
            <button
              onClick={() => {
                localStorage.removeItem("qzuser");
                localStorage.removeItem("authToken");
                navigate("/auth");
              }}
              className=" text-zinc-800 p-2 rounded-md"
            >
              Logout
            </button>
            <div className=" bg-[#6D56C8] text-white w-12 h-12 flex justify-center items-center rounded-full">
              {user[0].toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <Link to={"/auth"}>
              <button className=" bg-[#6D56C8] p-2 rounded-md text-white">
                Login
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
