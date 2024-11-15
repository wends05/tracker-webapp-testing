import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/UserContext";

const Dashboard = () => {
  const nav = useNavigate()
  return (
    <div className="flex flex-col gap-5 h-[50vh] items-center justify-center">
      <p>Dashboard</p>
    </div>
  );
};

export default Dashboard;
