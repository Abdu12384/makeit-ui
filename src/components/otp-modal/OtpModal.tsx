
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UseMutationResult } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import toast from "react-hot-toast"


interface OTPModalProps {
  isOpen: boolean
  onClose?: () => void
  onVerify?: (otp: string) => void
  data?: Record<string, any> 
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  mutation?: UseMutationResult<any, unknown, { formdata: Record<string, any>; otpString: string }, unknown>
  forgetPasswordMutation?: UseMutationResult<any,Error,
    {
      email: string
      enteredOtp: string
    }, unknown>
  resendOtp: UseMutationResult<any, unknown, string, unknown>
  email: string | undefined
  handleError: (error: unknown) => void
  handleSuccess: () => void
}

export function OTPModal({
  isOpen,
  data,
  setIsOpen,
  mutation,
  handleSuccess,
  handleError,
  resendOtp,
  email,
  forgetPasswordMutation,
  onClose,
}: OTPModalProps) {

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [activeInput, setActiveInput] = useState<number>(0)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(""))
      setActiveInput(0)
      setVerificationStatus("idle")
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 500)
    }
  }, [isOpen])

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, timeLeft])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (value === "" || /^\d$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value !== "" && index < 5) {
        setActiveInput(index + 1)
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp]
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)

      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5)
      setActiveInput(nextIndex)
      inputRefs.current[nextIndex]?.focus()
    }
  }


  const handleVerify = async () => {
    const otpString = otp.join("")
   if(data && mutation){
        if(otpString.length === 6){
           mutation.mutate({ formdata:data, otpString},{
             onSuccess:() =>{
               setVerificationStatus("success")
               handleSuccess()
             },
             onError:(error) =>{
               console.log('error in modal',error)
               setVerificationStatus('error')
               handleError(error)
             }
           })
        }
   }
     if(!data && email && forgetPasswordMutation){
       if(otpString.length === 6){
         forgetPasswordMutation.mutate({email, enteredOtp:otpString},{
            onSuccess:()=>{
              setVerificationStatus('success')
               handleSuccess()
            },
            onError: (error)=>{
               console.log('error in otp modal', error)
               setVerificationStatus('error')
               handleError(error)
            }
         })
       }
     }
    
  }

  const handleResendOtp = async () => {
    try {
      setIsLoading(true)
     resendOtp.mutate(email,{
       onSuccess: (data) => {
        setTimeLeft(60)
        toast.success(data)
        setIsLoading(false)
       },
       onError: (error)=>{
         console.log(error)
         setIsLoading(false)
       }
     })
    } catch (error) {
      handleError(error)
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    setIsOpen(false)
  }

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } },
  }

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.5,     
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  }

  const inputVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  }

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: 0.2,
      },
    },
  }

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={handleClose}
                className="absolute right-0 top-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>

              {verificationStatus === "success" ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-8"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                  <h2 className="mb-2 text-2xl font-bold">Verification Successful</h2>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Your identity has been verified successfully.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <h2 className="mb-2 text-2xl font-bold">Verification Code</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      We've sent a verification code to <span className="font-medium">{email}</span>
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-center space-x-2">
                      {otp.map((digit, index) => (
                        <motion.div
                          key={index}
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={index}
                        >
                          <Input
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className={`h-14 w-12 text-center text-xl font-bold ${
                              activeInput === index
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-gray-300 dark:border-gray-700"
                            } ${verificationStatus === "error" ? "border-red-500 dark:border-red-500" : ""}`}
                            disabled={verificationStatus === "loading"}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {verificationStatus === "error" && (
                      <motion.div
                        className="mt-2 flex items-center justify-center text-red-500"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <AlertCircle className="mr-1 h-4 w-4" />
                        <span className="text-sm">Invalid verification code. Please try again.</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="mb-6 text-center">
                    <div className="mb-2 text-sm font-medium">
                      Time remaining: <span className="text-primary">{formatTime(timeLeft)}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Didn't receive the code?{" "}
                      {timeLeft <= 0 ? (
                        <button
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="font-medium text-primary hover:underline disabled:opacity-50"
                        >
                          {isLoading ? "Sending..." : "Resend Code"}
                        </button>
                      ) : (
                        <span className="text-gray-400">
                          Resend code in <span className="font-medium">{formatTime(timeLeft)}</span>
                        </span>
                      )}
                    </p>
                  </div>

                  <Button
                    onClick={handleVerify}
                    disabled={otp.join("").length !== 6 || verificationStatus === "loading"}
                    className="w-full"
                  >
                    {verificationStatus === "loading" ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2 h-4 w-4"
                        >
                          <RefreshCw size={16} />
                        </motion.div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
