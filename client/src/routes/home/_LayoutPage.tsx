import { Outlet, useNavigate } from "react-router-dom";
import Drawer from "../../components/Sidebar";
import { useEffect } from "react";
import { supabase } from "../../utils/UserContext";

const LayoutPage = () => {
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      console.log(res);
      if (!res.data.session) {
        nav("/auth");
      }
    });
  }, [nav]);

  return (
    <div className="flex h-screen flex-col">
      <Drawer />
      <div className="h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutPage;
