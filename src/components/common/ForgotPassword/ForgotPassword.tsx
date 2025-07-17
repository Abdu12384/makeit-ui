import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useClientForgotPasswordMutation } from "@/hooks/ClientCustomHooks"

interface ForgotPasswordProps {
  userType?: "client" | "vendor"
}

export const ForgotPasswordEmail = ({ userType }: ForgotPasswordProps) => {
   console.log(userType)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const forgotPasswordMutation = useClientForgotPasswordMutation()
  const loginPath = userType === "vendor" ? "/vendor/login" : "/login"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email) {
      setError("Please enter your email address")
      return
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsSubmitting(true)
    setIsLoading(true)
    forgotPasswordMutation.mutate(email,{
      onSuccess:(data)=>{
         console.log(data)
         setIsSubmitted(true)
      },
      onError:(error)=>{
        setError(error?.message)
      },
      onSettled:()=>{
        setIsLoading(false)
      }
    })

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto  bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-24 bg-gradient-to-r from-purple-500 to-pink-500">
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="px-6 pt-16 pb-8">
        {!isSubmitted ? (
          <>
            <motion.h2
              className="text-2xl font-bold text-center text-gray-800 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Forgot Your Password?
            </motion.h2>
            <motion.p
              className="text-gray-600 text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Enter your email address and we'll send you a link to reset your password.
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 border ${
                      error ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium flex items-center justify-center hover:opacity-90 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <a onClick={()=>navigate(loginPath)} className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
                Back to Login
              </a>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-10 w-10 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to:
              <br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you don't see the email, check other places it might be, like your junk, spam, social, or other
              folders.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
            >
              Didn't receive the email? Try again
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
   </div> 
  )
}

export default ForgotPasswordEmail
