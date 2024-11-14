import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/UserContext";

const Dashboard = () => {
  const nav = useNavigate()
  const logOut = async () => {
    await supabase.auth.signOut();
    nav("/auth")
  }
  return (
    <div className="flex flex-col gap-5 h-[50vh] items-center justify-center">
      <p>Dashboard</p>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};

export default Dashboard;
