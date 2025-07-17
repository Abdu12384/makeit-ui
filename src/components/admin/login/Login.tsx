import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Truck, EyeOff, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Img2 from '@/assets/images/singupImages.jpeg'
import {  IAdmin, UserRoles } from "@/types/User"
import toast from "react-hot-toast"
import { useAdminLoginMutation } from "@/hooks/AdminCustomHooks"
import { useAppDispatch } from "@/store/store"
import { adminLogin } from "@/store/slices/admin.slice"
import LottieAnimation from "@/utils/animations/loatiieLoading"
import { validateLoginSingleField } from "@/utils/validationForms/validationForms"


interface FormData {
  email: string
  password: string
  role: UserRoles
}

interface FormErrors {
  email?: string
  password?: string
}

const initialValues = {
  email: "",
  password: "",
  role:'admin' as UserRoles
}

export function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialValues)
  const [commonLoading, setCommonLoading] = useState(false)
  const loginMutation = useAdminLoginMutation()
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const dispatch = useAppDispatch()
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value }

      // // const error = validateSingleField(name as "email" | "password", value)
      // setFormErrors((prevErrors) => ({
      //   ...prevErrors,
      //   [name]: error,
      // }))

      return updatedData
    })
  }





  async function handleSubmit(e: React.FormEvent){     
    e.preventDefault()  
    const emailError = validateLoginSingleField("email", formData.email)
    const passwordError = validateLoginSingleField("password", formData.password)
    const errors: FormErrors = {
      email: emailError,
      password: passwordError,
    }
    setFormErrors(errors)
    if (emailError || passwordError) {
      setIsLoading(false)
      return
    } 
    setIsLoading(true)
    try {
     console.log('usedata',formData)
    loginMutation.mutate(formData,{
       onSuccess:(data) =>{
        setCommonLoading(true)
        window.setTimeout(() => {
          dispatch(adminLogin(data.user as IAdmin))
          setCommonLoading(false)
        }, 3000);
       },
       onError:(error)=>{
        toast.error(error?.message )
        setIsLoading(false)
       }

    })
    } catch (error) {
      console.error("Login failed", error)
      setIsLoading(false)
    } 
  }
  

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center h-[90vh]">
            <LottieAnimation visible={commonLoading}/>
      <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Image (reversed from signup) */}
          <motion.div
            className="hidden md:block md:w-1/2 bg-[#a8b5a8] relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${Img2})` }}
            ></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white bg-gradient-to-t from-black/60 to-transparent">
              <motion.h2
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                Welcome Back to
                <br />
                Your Event Journey
                </motion.h2>
              <motion.p
                className="mb-8 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Plan, manage, and celebrate your moments seamlessly.
                <br />
                Let’s make your next event unforgettable!
              </motion.p>
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>100% Event Satisfaction</span>
                </div>
                <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>On-time Setup & Support</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="w-full max-w-md">
              <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                {/* Logo placeholder */}
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-md border-2 border-black flex items-center justify-center">
                    <div className="h-2 w-2 bg-black rounded-sm transform rotate-45"></div>
                  </div>
                  <span className="font-bold text-lg">MAKEIT</span>
                </div>
              </motion.div>

              <div className="text-center mb-8">
                <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">
                  Welcome back
                </motion.h1>
                <motion.p variants={itemVariants} className="text-gray-500">
                  Please enter your details to sign in
                </motion.p>
              </div>


              <motion.div variants={itemVariants} className="relative flex items-center justify-center mb-6">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="mx-4 text-sm text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </motion.div>

              <motion.form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-10 rounded-3xl shadow-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password<span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-10 rounded-3xl shadow-sm"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} /> */}
                  </div>
              
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white h-12 mt-6 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-transparent border-t-white animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
