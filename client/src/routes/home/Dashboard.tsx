import { Outlet } from "react-router-dom";

const Dashboard = () => {


  return (
    <div className="flex flex-col gap-5 h-[50vh] items-center justify-center">
      <Outlet />
      <p>Dashboard</p>
    </div>
  );
};

export default Dashboard;
