import { FormEvent, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";



const Register = () => {
  const [change, setChange] = useState("SIGN UP");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (username === "" || email === "" || password === "") {
      console.log("EMPTY FIELD(S)");






      return;
    } else {
      console.log("the form is submitted!");
      try {
        await fetch(`http://localhost:3000/user`, {
          method: "POST",
          body: JSON.stringify({ username, email }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.log("ERROR FETCH");
      }
    }
  };

  return (
    <div className="flex bg-gradient-to-t from-[#4C9182] to-[#D9DBBC] w-full h-screen">
      <div className="flex justify-center items-center w-full h-full ">
        <div className="flex flex-col items-center py-10 justify-center w-4/4  bg-white/50 rounded-3xl shadow-md ">
          <p className="text-[#292421] text-[40px] font-bold">{change}</p>
          <div className="flex">
            <button
              className={
                change === "LOG IN"
                  ? "w-[151px] h-[50px] rounded-l-full bg-[#F1E7DD] p-[10px] mx- text-[#292421] hover:bg-[#e4e4e4]"
                  : "w-[151px] h-[50px] rounded-l-full bg-[#2F4F4F] p-[10px] mx- hover:bg-[#7A9590]"
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
                  ? "w-[151px] h-[50px] rounded-r-full bg-[#F1E7DD] p-[10px] mx- text-[#292421] hover:bg-[#e4e4e4]"
                  : "w-[151px] h-[50px] rounded-r-full bg-[#2F4F4F] p-[10px] mx- hover:bg-[#7A9590]"
              }
              onClick={() => {
                setChange("LOG IN");
              }}
            >
              LOG IN
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="inputs flex flex-col px-20 py-10">
              <div className="username relative">
                {change === "LOG IN" ? (
                  <div></div>
                ) : (
                  <>
                    <h6 className="text-gray-500 text-xs flex justify-center items-center ">
                      Already have an account? Log in now
                    </h6>

                    <input
                      className="w-[400px] h-[54px] rounded-[50px] my-4 bg-[#e9e9e9] hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F] placeholder:[#6b7280] ps-[70px] font-light overflow-x-auto"
                      placeholder="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLockPasswordFill
                  color="#D9B9A0"
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
                />
              </div>
            </div>
            <div className="buttons flex flex-row justify-center items-center">
              <input
                type="submit"
                className="bg-slate-600 active:bg-[#F1E7DD]"
                title={change}
                id="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
