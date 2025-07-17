"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Search, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"

const NotFound404: React.FC = () => {
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue) {
      setIsSearching(true)
      setTimeout(() => {
        setIsSearching(false)
        setSearchValue("")
      }, 2000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const numberVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.8,
      },
    },
  }

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  const astronautVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-white overflow-hidden relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Animated planet */}
      <motion.div
        className="absolute right-[5%] top-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-700 opacity-70 blur-sm"
        variants={floatVariants}
        initial="initial"
        animate="animate"
      />

      {/* Main content container */}
      <motion.div className="relative z-10 max-w-3xl w-full flex flex-col items-center" variants={containerVariants}>
        {/* 404 Number */}
        <motion.div className="relative" variants={numberVariants}>
          <motion.h1
            className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
            animate={{
              textShadow: [
                "0 0 5px rgba(168, 85, 247, 0.5)",
                "0 0 20px rgba(168, 85, 247, 0.8)",
                "0 0 5px rgba(168, 85, 247, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            404
          </motion.h1>

          {/* Astronaut */}
          <motion.div
            className="absolute -top-10 -right-16 w-32 h-32"
            variants={astronautVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="w-full h-full relative"
              initial={{ rotate: 0 }}
              animate={{
                rotate: 360,
                transition: {
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-20 bg-gray-300 rounded-t-full relative">
                  {/* Helmet */}
                  <div className="absolute inset-0 rounded-t-full bg-gradient-to-b from-blue-200 to-transparent opacity-50"></div>
                  {/* Body */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-14 bg-white rounded-md"></div>
                  {/* Backpack */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gray-400 rounded-md"></div>
                  {/* Arms */}
                  <div className="absolute bottom-6 -left-4 w-4 h-8 bg-white rounded-full"></div>
                  <div className="absolute bottom-6 -right-4 w-4 h-8 bg-white rounded-full"></div>
                  {/* Legs */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 -ml-4 w-3 h-6 bg-white rounded-full"></div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 ml-2 w-3 h-6 bg-white rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div className="text-center mt-8" variants={itemVariants}>
          <h2 className="text-3xl font-bold mb-4 text-white">Houston, we have a problem!</h2>
          <p className="text-xl text-gray-300 mb-8">The page you're looking for has drifted into deep space.</p>
        </motion.div>

        {/* Search bar */}
        <motion.form className="w-full max-w-md mb-8 relative" variants={itemVariants} onSubmit={handleSearch}>
      
          <motion.button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isSearching}
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <RefreshCw size={18} />
              </motion.div>
            ) : (
              <Search size={18} />
            )}
          </motion.button>
        </motion.form>

        {/* Action buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-4 w-full max-w-md" variants={itemVariants}>
          <Link to="/" >
          <motion.button
            variants={buttonHoverVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
          >
            <ArrowLeft size={18} />
            <span>Go Home</span>
          </motion.button>
          </Link>


          <Link to="/" className="flex-1">
            <motion.button
              variants={buttonHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="w-full px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/20 transition-colors"
            >
              Report Issue
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute left-[10%] bottom-[20%] w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-60 blur-sm"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      />

      <motion.div
        className="absolute left-[20%] top-[30%] w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-60 blur-sm"
        variants={floatVariants}
        initial="initial"
        animate="animate"
      />

      <motion.div
        className="absolute right-[15%] bottom-[30%] w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 opacity-60 blur-sm"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      />

      {/* Meteor animations */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-20 bg-gradient-to-b from-white to-transparent"
          style={{
            top: `${Math.random() * -10}%`,
            left: `${Math.random() * 100}%`,
            rotate: "30deg",
            transformOrigin: "center",
          }}
          animate={{
            top: "120%",
            left: `${Math.random() * 100 - 20}%`,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 5 + 2,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  )
}

export default NotFound404
