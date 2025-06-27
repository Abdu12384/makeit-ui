import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Truck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import  {FormData,FormErrors, validateSingleField} from "@/utils/validationForms/validationForms"
import { useClientSignupMutation, useCreateAccountMutation, useResendOtpClientMutaion } from "@/hooks/ClientCustomHooks"
import { EyeOff, Eye } from "lucide-react"
import { OTPModal } from "@/components/otp-modal/OtpModal"
import { useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import toast from "react-hot-toast"
import imgsignup from "@/assets/images/clientsignupimage.jpg"




const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  role: "client" 

}



export default function SignupComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<FormData>(initialValues)

  const [formData, setFormData] = useState<FormData>(initialValues)
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const signupMutation =  useClientSignupMutation()
  const mutationCreateAccount = useCreateAccountMutation()
  const resendOtpMutaion = useResendOtpClientMutaion()
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
  
      // Live validation
      const error = validateSingleField(name as keyof FormData, value, updatedData);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
  
      return updatedData;
    });
    
  }





  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setData(formData)
    try {
    
     signupMutation.mutate(formData,{
       onSuccess:()=> {
         setIsOpen(true)
       },
       onError:(error:any)=>{
         toast.error(error?.response?.data?.message)
         setIsOpen(false)
       }
     })

    } catch (error) {
      console.error('erreer',error)
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


  const navigate = useNavigate()
 
  const handleMutationSuccess = () =>{
    setTimeout(() => {
      navigate("/login",{replace:true})
    }, 3000);
  }

  const handleMutationError = (error:unknown) =>{
    let message = "An unexpected error occured"
    if(isAxiosError(error)){
      console.log(error)
      message = error.response?.data.message || "An error eccurred"
    }
    toast.error(message)
    
  }


  return (
    <>
      {/* Left side - Form */}
      <div className="min-h-screen   bg-gray-100 flex items-center justify-center h-[90vh]">
      <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
      <motion.div
        className="w-full md:w-1/2 p-8 md:p-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6">
          {/* <CoralsLogo /> */}
        </motion.div>
       <div className="flex  flex-col justify-center items-center">

        <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">
          Create your account
        </motion.h1>
        <motion.p variants={itemVariants} className="text-gray-500 mb-1">
          Let&apos;s get started with your 30 days free trial
        </motion.p>


        </div>
        <motion.div variants={itemVariants} className="relative flex items-center justify-center">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="mx-4 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </motion.div>

        <div className="w-full max-w-sm mx-auto bg-white p-2 rounded-x flex justify-center items-center">
        <motion.form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <Label htmlFor="name" className="text-sm font-medium">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              className="w-[350px] h-10 rounded-3xl shadow-sm"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="email" className="text-sm font-medium">
              Email<span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-[350px] h-10 rounded-3xl shadow-sm "
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              className="w-[350px] h-10 rounded-3xl shadow-sm "
              value={formData.phone}
              onChange={handleChange}
            />
          {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>} 
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
              className="w-[350px] h-10 rounded-3xl shadow-sm "
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

          <motion.div variants={itemVariants}>
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="w-[350px] h-10 rounded-3xl shadow-sm "
              value={formData.confirmPassword}
              onChange={handleChange}
            />
           <button
             type="button"
             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
             tabIndex={-1}
             >
             {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          </div>
          {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>} 
          </motion.div>


          <motion.div variants={itemVariants}>
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white h-12 mt-6 rounded-full">
              Sign Up
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center text-sm mt-6">
            Already have an account?{" "}
            <a onClick={()=>navigate('/login')} className="text-blue-600 hover:underline">
              Log in
            </a>
          </motion.div>
        </motion.form>
        </div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div
        className="hidden md:block md:w-1/2 bg-[#a8b5a8] relative overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgsignup})` }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white bg-gradient-to-t from-black/60 to-transparent">
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
         Crafting Unforgettable Event Experiences
          <br />
          For Every Occasion
          </motion.h2>
          <motion.p
            className="mb-8 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
          From intimate gatherings to grand celebrations, our expertise lies in
          <br />
            buildings communities and place in special situations
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span></span>
            </div>
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span></span>
            </div>
          </motion.div>
        </div>
      </motion.div>
      </div>
      </div>
      <OTPModal isOpen={isOpen} data={data} setIsOpen={setIsOpen} resendOtp={resendOtpMutaion} mutation={mutationCreateAccount} email={data?.email} handleError={handleMutationError}  handleSuccess={handleMutationSuccess}/>
    </div>
    </>
  )
}
