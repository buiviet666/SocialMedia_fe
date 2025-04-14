import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <h1>mainn</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
