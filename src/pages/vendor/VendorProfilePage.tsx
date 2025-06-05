// import React from "react"
// import { motion } from "framer-motion"
// import { CircularSidebar } from "@/components/vendor/vendorProfile/Profile-sidebar"
// import { Outlet } from "react-router-dom" // Import the Outlet component

// export const VendorProfilePage: React.FC = () => {
//   return (
//     <div className="flex min-h-screen bg-white text-white">
//       <CircularSidebar />
//       <motion.main
//         className="flex-1 overflow-y-auto p-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* The Outlet will render the child route components here */}
//         <Outlet />
//       </motion.main>
//     </div>
//   )
// }

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { CircularSidebar } from "@/components/vendor/vendorProfile/Profile-sidebar"

export const VendorProfilePage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true); // [CHANGED! (added state to control sidebar visibility)]
  let scrollTimeout: NodeJS.Timeout;

  useEffect(() => {
    const handleScroll = () => {
      setShowSidebar(true); // [CHANGED! (show sidebar on scroll)]
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setShowSidebar(false); // [CHANGED! (hide sidebar after delay)]
      }, 10000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // [CHANGED! (clean up scroll event listener)]
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      {showSidebar && <CircularSidebar />} {/* [CHANGED! (conditionally render sidebar)] */}
      <motion.main
        className="flex-1 overflow-y-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};
