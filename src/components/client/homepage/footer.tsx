import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }


  return (
    <footer className="bg-[#212A31] text-white pt-16 pb-8">
      <div className=" px-4 md:px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  About Us
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Our Team
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Careers
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Press
                </a>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Event Planning
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Vendor Marketplace
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Venue Booking
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Event Management
                </a>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Help Center
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  FAQs
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Contact Us
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <a href="#" className="text-[#D3D9D4] hover:text-white transition-colors">
                  Terms of Service
                </a>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <motion.li className="flex items-start gap-3" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-[#124E66]" />
                <span className="text-[#D3D9D4]">123 Event Street, Suite 100, City, State 12345</span>
              </motion.li>
              <motion.li className="flex items-center gap-3" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <Phone className="h-5 w-5 shrink-0 text-[#124E66]" />
                <span className="text-[#D3D9D4]">(123) 456-7890</span>
              </motion.li>
              <motion.li className="flex items-center gap-3" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                <Mail className="h-5 w-5 shrink-0 text-[#124E66]" />
                <span className="text-[#D3D9D4]">info@eventplatform.com</span>
              </motion.li>
            </ul>
            <div className="flex gap-4 mt-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="h-10 w-10 rounded-full bg-[#2E3944] flex items-center justify-center hover:bg-[#124E66] transition-colors text-white"
                  custom={index}
                  // variants={socialVariants}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{Icon.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="border-t border-[#2E3944] pt-8 text-center text-sm text-[#748D92]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>© {new Date().getFullYear()} Event Platform. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
