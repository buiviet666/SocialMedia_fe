import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="flex-[1] ml-[76px] h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
