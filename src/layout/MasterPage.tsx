import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

type MasterPageProps = {
  children: React.ReactNode;
};

const MasterPage: React.FC<MasterPageProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = () => setMobileOpen(true);
  const handleDrawerClose = () => setMobileOpen(false);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerClose} />
      <div className="flex-grow-1 d-flex flex-column">
        <Topbar onMenuClick={handleMenuClick} />
        <main className="flex-grow-1 p-3 bg-light">{children}</main>
      </div>
    </div>
  );
};

export default MasterPage;
