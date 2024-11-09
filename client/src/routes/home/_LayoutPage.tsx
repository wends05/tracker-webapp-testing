import { Outlet, useNavigate } from "react-router-dom";
import Drawer from "../../components/Sidebar";
import { useEffect } from "react";
import { supabase } from "../../utils/UserContext";

const LayoutPage = () => {
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(res => {
      console.log(res)
      if (!res.data.session) {
        nav("/register");
      }
    });
  }, []);
  return (
    <>
      LayoutPage
      <Drawer />
      <Outlet />
    </>
  );
};

export default LayoutPage;
