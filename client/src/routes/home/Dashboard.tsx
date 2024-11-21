import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-5">
      <Outlet />
      <p>Dashboard</p>
    </div>
  );
};

export default Dashboard;
