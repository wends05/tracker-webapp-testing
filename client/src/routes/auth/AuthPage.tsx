import { FormEvent, useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { supabase, UserContext } from "../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "./../../assets/logo.png";
import { User } from "@/utils/types";
import { BackendResponse } from "@/interfaces/BackendResponse";
// import logo_name from "./../../assets/logo_name.png";
// import button from "./../../../src/index.css"
// import { ToastAction } from "@/components/ui/toast"

const AuthPage = () => {
  const { supabaseSession } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    if (supabaseSession) {
      nav("/dashboard");
    } else {
      setLoading(false);
    }
  }, []);
  const { toast } = useToast();

  const [change, setChange] = useState("LOG IN");
  const { setUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  const text = (change: string) => {
    if (change === "LOG IN") {
      return "Welcome back!";
    } else return "Sign up to begin";
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setLoading(true);

    try {
      if (change === "LOG IN") {
        if (email === "" || password === "") {
          throw new Error("Empty email or password");
        }
        console.log(change);
        setLoading(false);
      } else {
        if (email === "" || password === "" || username === "")
          throw new Error("Empty input fields");
        setLoading(false);
      }

      if (change === "SIGN UP") {
        await register();
        setLoading(false);
      } else {
        await logIn();
        setLoading(false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      console.log("ERROR FETCH: ", error.message);
    }
    setLoading(false);
  };

  const logIn = async () => {
    setLoading(true);

    console.log("HSHDASDHAGSCHAJSHGDAJHGSDA");
    console.log("EMAIL: " + email);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      throw new Error("Error signing in: " + error.message);
    }

    // get user from database
    const fetchedUser = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/user?email=${email}`
    );

    if (fetchedUser.status === 200) {
      const { data } = (await fetchedUser.json()) as BackendResponse<User>;
      setUser(data);
      nav("/dashboard");

      return;
    }
    // if it does not exist then create a new user

    const { data } = await createUser();

    setUser(data);
    nav("/dashboard");
    setLoading(false);

    // add user to context
  };

  const register = async () => {
    setLoading(true);

    if (username === "") {
      throw new Error("Empty username");
    }

    if (/[A-Z]/.test(email)) {
      throw new Error("Email should not contain capital letters");
    }
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      throw new Error("Error signing up: " + error.message);
    }

    await createUser();
    toast({
      title: "Congratulations!",
      description: "Your account has been registered",
    });
    console.log("registered!");

    setLoading(false);
  };

  const createUser = async () => {
    return await fetch(`${import.meta.env.VITE_SERVER_URL}/user`, {
      method: "POST",
      body: JSON.stringify({ username, email }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json() as Promise<BackendResponse<User>>);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-t from-[#4C9182] to-[#D9DBBC]">
      {loading ? (
        <>
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
            <l-bouncy size="77" speed="1.75" color="black"></l-bouncy>
          </div>
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-4/4 flex flex-col items-center justify-center rounded-3xl bg-white/50 py-10 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-vanilla/60 ml-10 flex flex-col items-center justify-center rounded-xl shadow-xl">
                  <h1 className="text-darkCopper text-[40px] font-bold">
                    {text(change)}
                  </h1>

                  <div className="flex pt-7">
                    <button
                      className={
                        change === "SIGN UP"
                          ? "hover:text-vanilla border-vanilla h-[50px] w-[151px] rounded-l-full border-2 bg-none p-[10px] text-[#292421] transition duration-300 ease-linear hover:bg-[#2F4F4F]"
                          : "text-vanilla h-[50px] w-[151px] scale-110 rounded-l-full bg-[#2F4F4F] p-[10px] font-bold shadow-md shadow-black transition duration-300 ease-linear hover:bg-[#7A9590]"
                      }
                      onClick={() => setChange("LOG IN")}
                    >
                      LOG IN
                    </button>
                    <button
                      className={
                        change === "LOG IN"
                          ? "hover:text-vanilla border-vanilla h-[50px] w-[151px] rounded-r-full border-2 bg-none p-[10px] text-[#292421] transition duration-300 ease-linear hover:bg-[#2F4F4F]"
                          : "text-vanilla h-[50px] w-[151px] scale-110 rounded-r-full bg-[#2F4F4F] p-[10px] font-bold shadow-md shadow-black transition duration-300 ease-linear hover:bg-[#7A9590]"
                      }
                      onClick={() => setChange("SIGN UP")}
                      data-testid="SIGN UP"
                    >
                      SIGN UP
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="inputs flex flex-col items-center px-20 py-10"
                  >
                    {change === "SIGN UP" && (
                      <div className="username relative">
                        <input
                          className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[50px] bg-[#e9e9e9] ps-[70px] font-light transition delay-300 ease-out hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
                          placeholder="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser
                          color="#D9B9A0"
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
                        />
                      </div>
                    )}

                    <div className="email relative">
                      <input
                        className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[30px] bg-[#e9e9e9] ps-[70px] font-light hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
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
                        className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[30px] bg-[#e9e9e9] ps-[70px] font-light hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
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
                      className="mt-10 w-max transition delay-100 ease-in"
                      id="submit"
                      data-testid="submit"
                    >
                      {change}
                    </button>
                  </form>
                </div>

                <div className="hidden flex-col items-center justify-center md:flex">
                  <img
                    src={logo}
                    alt="Logo"
                    className="max-w-full object-contain"
                  />
                  <h2 className="mt-2 text-xl font-bold text-[#292421]">
                    Welcome to WaEase
                  </h2>
                  <p className="text-md mt-2 text-center text-[#6b7280]">
                    Join us and experience the new level of budgeting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-4/4 flex flex-col items-center justify-center rounded-3xl bg-white/50 py-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Form Section */}
              <div className="lg:bg-vanilla/60 flex flex-col items-center justify-center rounded-xl md:ml-0 md:bg-none md:shadow-none lg:ml-10 lg:shadow-xl">
                <h2 className="text-darkCopper text-[40px] font-semibold">
                  {text(change)}
                  <hr className="mt-4 h-0.5 bg-black dark:bg-black"></hr>
                </h2>

                <div className="flex pt-7">
                  <button
                    className={
                      change === "SIGN UP"
                        ? "hover:text-vanilla border-vanilla h-[50px] w-[151px] rounded-l-full border-2 bg-none p-[10px] text-[#292421] transition duration-300 ease-linear hover:bg-[#2F4F4F]"
                        : "text-vanilla h-[50px] w-[151px] scale-110 rounded-l-full bg-[#2F4F4F] p-[10px] font-bold shadow-md shadow-black transition duration-300 ease-linear hover:bg-[#7A9590]"
                    }
                    onClick={() => setChange("LOG IN")}
                  >
                    LOG IN
                  </button>
                  <button
                    className={
                      change === "LOG IN"
                        ? "hover:text-vanilla border-vanilla h-[50px] w-[151px] rounded-r-full border-2 bg-none p-[10px] text-[#292421] transition duration-300 ease-linear hover:bg-[#2F4F4F]"
                        : "text-vanilla h-[50px] w-[151px] scale-110 rounded-r-full bg-[#2F4F4F] p-[10px] font-bold shadow-md shadow-black transition duration-300 ease-linear hover:bg-[#7A9590]"
                    }
                    onClick={() => setChange("SIGN UP")}
                    data-testid="SIGN UP"
                  >
                    SIGN UP
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="inputs flex flex-col items-center px-20 py-10"
                >
                  {change === "SIGN UP" && (
                    <div className="username relative">
                      <input
                        className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[50px] bg-[#e9e9e9] ps-[70px] font-light transition delay-300 ease-out hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
                        placeholder="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <FaUser
                        color="#D9B9A0"
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
                      />
                    </div>
                  )}

                  <div className="email relative">
                    <input
                      className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[30px] bg-[#e9e9e9] ps-[70px] font-light hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
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
                      className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[30px] bg-[#e9e9e9] ps-[70px] font-light hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
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
                    className="mt-10 w-max transition delay-100 ease-in"
                    id="submit"
                    data-testid="submit"
                  >
                    {change}
                  </button>
                </form>
              </div>

              {/* Logo Section */}
              <div className="hidden flex-col items-center justify-center lg:flex">
                <img
                  src={logo}
                  alt="Logo"
                  className="max-w-full object-contain"
                />
                <h2 className="mt-2 text-xl font-bold text-[#292421]">
                  Welcome to WaEase
                </h2>
                <p className="text-md mt-2 text-center text-[#6b7280]">
                  Join us and experience the new level of budgeting
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
