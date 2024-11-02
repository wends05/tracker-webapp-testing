import { Outlet, useNavigate } from "react-router-dom";
import Drawer from "../../components/Drawer";
import { useContext, useEffect } from "react";
import { UserContext } from "../../utils/UserContext";

const LayoutPage = () => {
  const { supabaseSession } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    console.log(supabaseSession);
    if (!supabaseSession) {
      nav("/not-logged-in");
    }
  }, [supabaseSession]);
  return (
    <>
      LayoutPage
      <Drawer />
      <Outlet />
    </>
  );
};

export default LayoutPage;
