import { useContext, useEffect, useState } from "react";
import { UserContext } from "../utils/UserContext";
import { Link, useNavigate } from "react-router-dom";

const NotLoggedIn = () => {
  const { supabaseSession } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  // useEffect(() => {
  //   if (supabaseSession) {
  //     nav("/dashboard");
  //   }
  //   setLoading(false);
  // }, [supabaseSession]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      {loading ? (
        <>loading...</>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <Link to={"/login"}>Log In here</Link>
        </>
      )}
    </div>
  );
};

export default NotLoggedIn;
