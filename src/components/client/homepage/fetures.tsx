import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import fetureIMG from '@/assets/images/feturepageIMG.jpg'

const features = [
  "Connect with verified vendors",
  "Browse upcoming events in your area",
  "Secure bookings with instant confirmation",
  "Read authentic reviews from real customers",
  "Get personalized recommendations",
  "Manage all your events in one place",
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Transform scale based on scroll position
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 1, 1])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, 0])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 2])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.section
      ref={sectionRef}
      className="py-20 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${fetureIMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity,
          y: useTransform(scrollYProgress, [0, 1], [50, -50]),
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/90 z-0"></div>

      <div className="px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#212A31] mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Our Platform?
            </motion.h2>
            <motion.ul
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-[#2E3944]"
                  variants={itemVariants}
                  whileHover={{
                    x: 5,
                    color: "#124E66",
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.2,
                      transition: { duration: 0.5 },
                    }}
                  >
                    <CheckCircle className="h-6 w-6 text-[#124E66] shrink-0 mt-0.5" />
                  </motion.div>
                  <span className="text-lg">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  y: { type: "spring", stiffness: 300, damping: 10 },
                }}
              >
                <Button className="bg-[#124E66] hover:bg-[#0e3e52] text-white rounded-full px-8 py-6 text-lg">
                  Get Started Today
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            ref={imageRef}
            className="relative h-[400px] rounded-xl overflow-hidden shadow-xl"
            style={{ scale, y, rotate }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <img
              src={fetureIMG}
              alt="Platform features"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/70 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <motion.h3
                  className="text-2xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Ready to elevate your events?
                </motion.h3>
                <motion.p
                  className="text-white/80 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Join thousands of satisfied customers who have transformed their event experiences with our platform.
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button className="bg-white text-[#124E66] hover:bg-white/90 rounded-full">Sign Up Now</Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
