import { FormEvent, useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { supabase, UserContext } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [change, setChange] = useState("LOG IN");

  const { setUser } = useContext(UserContext);
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session) {
        nav("/dashboard");
      } else {
        setLoading(false)
      }
    });
  }, []);

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      if (email === "" || password === "") {
        throw new Error("Empty email or password");
      }
      console.log(change);

      if (change === "SIGN UP") {
        register();
      } else {
        logIn();
      }
    } catch (error: any) {
      console.log("ERROR FETCH: ", error.message);
    }
  };

  const logIn = async () => {
    console.log("EMAIL: " + email);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error("Error signing in: " + error.message);
    }

    // get user from database
    const fetchedUser = await fetch(
      `http://localhost:3000/user?email=${email}`
    );

    if (fetchedUser.status === 200) {
      const { data } = await fetchedUser.json();
      setUser(data);
      nav("/dashboard");

      return;
    }
    // if it does not exist then create a new user

    const { data } = await createUser();
    setUser(data);
    nav("/dashboard");

    // add user to context
  };

  const register = async () => {
    if (username === "") {
      throw new Error("Empty username");
    }

    const fetchedUser = await fetch(
      `http://localhost:3000/user?email=${email}`
    );

    if (fetchedUser.status === 200) {
      throw new Error("User already exists");
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw new Error("Error signing up: " + error.message);
    }

    await createUser();
    console.log("registered!");
  };

  const createUser = async () => {
    return await fetch(`http://localhost:3000/user`, {
      method: "POST",
      body: JSON.stringify({ username, email }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  return (
    <div className="flex bg-gradient-to-t items-center justify-center from-[#4C9182] to-[#D9DBBC] w-full h-screen">
      {loading ? (
        <>
          <div>
            <div className="py-10 justify-center px-10 bg-white/50 rounded-3xl shadow-md ">
              <p className="text-[#292421] text-[40px] font-bold">Loading...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex flex-col items-center py-10 justify-center w-4/4  bg-white/50 rounded-3xl shadow-md ">
            <p className="text-[#292421] text-[40px] font-bold">{change}</p>
            <div className="flex">
              <button
                className={
                  change === "SIGN UP"
                    ? "w-[151px] h-[50px] rounded-l-full bg-[#F1E7DD] p-[10px] mx- text-[#292421] hover:bg-[#e4e4e4]"
                    : "w-[151px] h-[50px] rounded-l-full bg-[#2F4F4F] p-[10px] mx- hover:bg-[#7A9590]"
                }
                onClick={() => {
                  setChange("LOG IN");
                }}
              >
                LOG IN
              </button>
              <button
                className={
                  change === "LOG IN"
                    ? "w-[151px] h-[50px] rounded-r-full bg-[#F1E7DD] p-[10px] mx- text-[#292421] hover:bg-[#e4e4e4]"
                    : "w-[151px] h-[50px] rounded-r-full bg-[#2F4F4F] p-[10px] mx- hover:bg-[#7A9590]"
                }
                onClick={() => {
                  setChange("SIGN UP");
                }}
              >
                SIGN UP
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="inputs flex flex-col px-20 py-10 items-center"
            >
              <div className="username relative">
                {change === "SIGN UP" && (
                  <>
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
              <button
                type="submit"
                className="py-2 px-4 w-max bg-copper hover:bg-[#6f4717] text-white rounded-lg "
                id="submit"
                name="hahaha"
              >
                {change}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
