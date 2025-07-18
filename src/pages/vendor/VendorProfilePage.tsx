
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { CircularSidebar } from "@/components/vendor/vendorProfile/Profile-sidebar"

export default function VendorProfilePage() {
  // const [showSidebar, setShowSidebar] = useState(true); // [CHANGED! (added state to control sidebar visibility)]
  // let scrollTimeout: NodeJS.Timeout;

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setShowSidebar(true); // [CHANGED! (show sidebar on scroll)]
  //     clearTimeout(scrollTimeout);
  //     scrollTimeout = setTimeout(() => {
  //       setShowSidebar(false); // [CHANGED! (hide sidebar after delay)]
  //     }, 50000);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll); // [CHANGED! (clean up scroll event listener)]
  // }, []);

  return (
    <div className="flex min-h-screen bg-white">
     <CircularSidebar />
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
