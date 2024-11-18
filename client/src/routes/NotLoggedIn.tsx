import { Link } from "react-router-dom";

const NotLoggedIn = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h1>You are not logged in</h1>
      <Link to={"/login"}>Log In here</Link>
    </div>
  );
};

export default NotLoggedIn;
