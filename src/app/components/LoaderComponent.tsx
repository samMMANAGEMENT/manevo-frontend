import { motion } from "framer-motion";
import React from "react";

interface TopLoaderProps {
  progress: number;
  hasError?: boolean;
  visible?: boolean;
}

const LoaderComponent: React.FC<TopLoaderProps> = ({
  progress,
  hasError = false,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-1 bg-gray-300 z-9999"
      style={{ overflow: "hidden" }}
    >
      <motion.div
        className="h-full"
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
        style={{
          backgroundColor: hasError ? "red" : "black",
        }}
      />
    </div>
  );
};

export default LoaderComponent;
