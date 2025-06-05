"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BannerImage {
  id: number
  url: string
  title: string
  subtitle: string
}

interface BannerCarouselProps {
  images: BannerImage[]
}

export const BannerCarousel = ({ images }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null)

  // Auto slide banner
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
      }
    }
  }, [images.length])

  // Reset timer when manually changing slides
  const resetSlideTimer = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current)
    }
    autoSlideRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    resetSlideTimer()
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    resetSlideTimer()
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.section initial="hidden" animate="visible" variants={fadeIn} className="mb-10">
      <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${images[currentIndex].url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-transparent flex items-center">
                <div className="p-8 md:p-16 max-w-lg">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                  >
                    {images[currentIndex].title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-lg md:text-xl text-white/90"
                  >
                    {images[currentIndex].subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full p-2 text-white transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full p-2 text-white transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                resetSlideTimer()
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
