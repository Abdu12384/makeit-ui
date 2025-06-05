import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const RequestButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Button
        variant="outline"
        size="lg"
        className={cn(
          "bg-gray-700/50 hover:bg-gray-700 text-white border-none",
          "relative group transition-all duration-300"
        )}
        asChild
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span 
            initial={{ x: -5 }}
            animate={{ x: 0 }}
            className="flex items-center gap-2"
          >
            <Send size={16} />
            Request
          </motion.span>
          <motion.div
            className="bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center absolute -top-2 -right-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
              delay: 0.2
            }}
          >
            3
          </motion.div>
        </motion.button>
      </Button>
    </motion.div>
  );
};

