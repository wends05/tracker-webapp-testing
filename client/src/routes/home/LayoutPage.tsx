import { Outlet } from "react-router-dom";
import Drawer from "../../components/Drawer";

const LayoutPage = () => {
  return (
    <>
      LayoutPage
      <Drawer />
      <Outlet />
    </>
  );
};

export default LayoutPage;
