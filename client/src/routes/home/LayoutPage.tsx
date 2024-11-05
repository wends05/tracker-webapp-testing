import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const LayoutPage = () => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="min-h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutPage;
