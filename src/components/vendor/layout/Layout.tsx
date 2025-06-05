import React from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SimpleAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 h-16 border-b bg-white">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-purple-600">VendorVista</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              to="/profile"
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default SimpleAppLayout;