import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5">
      <p>Dashboard</p>
      <Link to={"category/add"}>Add Category</Link>
      <Outlet />
    </div>
  );
};

export default Dashboard;
