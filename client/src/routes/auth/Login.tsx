import { FormEvent, useState } from "react";
import { supabase,  } from "../../utils/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
  };

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       Please wait...
  //     </div>
  //   );

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <h2>Log In with your account</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email">email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">password</label>
            <input
              type="text"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Login;
