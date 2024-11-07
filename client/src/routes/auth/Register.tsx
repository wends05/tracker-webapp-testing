import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

const Register = () => {
  const [change, setChange] = useState("SIGN UP");
  return (
    <div className="flex bg-gradient-to-t from-[#4C9182] to-[#D9DBBC] w-full h-screen">
      <div className="flex justify-center items-center w-full h-full ">
        <div className="flex flex-col items-center justify-center bg-white/50 h-3/4 w-4/4 rounded-3xl shadow-md ">
          <text className="text-[#292421] text-[40px] font-bold">{change}</text>
          <div className="inputs flex flex-col px-20 py-10">
            <div className="icons flex flex-col items-left space-y-16 absolute text-xl mt-9 ml-5"></div>

            <div className="username relative">
              {change === "LOG IN" ? (
                <div></div>
              ) : (
                <>
                  <input
                    className="w-[400px] h-[54px] rounded-[50px] my-4 bg-[#e9e9e9] hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F] placeholder:[#6b7280] ps-[70px] font-light overflow-x-auto"
                    placeholder="username"
                    type="text"
                  />
                  <FaUser
                    color="#D9B9A0"
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
                  />
                </>
              )}
            </div>
            <div className="email relative">
              <input
                className="w-[400px] h-[54px] rounded-[30px] my-4 bg-[#e9e9e9] hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F] placeholder:[#6b7280] ps-[70px] font-light overflow-x-auto"
                placeholder="email"
                type="text"
              />
              <MdEmail
                color="#D9B9A0"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
              />
            </div>

            <div className="password relative">
              <input
                className="w-[400px] h-[54px] rounded-[30px] my-4 bg-[#e9e9e9] hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F] placeholder:[#6b7280] ps-[70px] font-light overflow-x-auto"
                placeholder="password"
                type="text"
              />
              <RiLockPasswordFill
                color="#D9B9A0"
                className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
              />
            </div>
          </div>
          <div className="buttons flex flex-row justify-center items-center">
            <button
              className={
                change === "LOG IN"
                  ? "w-[151px] h-[50px] rounded-full bg-[#F1E7DD] p-[10px] mx-10 text-[#292421] hover:bg-[#e4e4e4]"
                  : "w-[151px] h-[50px] rounded-full bg-[#2F4F4F] p-[10px] mx-10 hover:bg-[#7A9590]"
              }
              onClick={() => {
                setChange("SIGN UP");
              }}
            >
              SIGN UP
            </button>
            <button
              className={
                change === "SIGN UP"
                  ? "w-[151px] h-[50px] rounded-full bg-[#F1E7DD] p-[10px] mx-10 text-[#292421] hover:bg-[#e4e4e4]"
                  : "w-[151px] h-[50px] rounded-full bg-[#2F4F4F] p-[10px] mx-10 hover:bg-[#7A9590]"
              }
              onClick={() => {
                setChange("LOG IN");
              }}
            >
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
