import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Truck, EyeOff, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "react-hot-toast" 
import { useCreateAccountMutation, useUploadeImageToCloudinaryMutation, useVendorSignupMutation } from "@/hooks/VendorCustomHooks"
import { OTPModal } from "@/components/otp-modal/OtpModal"
import { useResendOtpClientMutaion } from "@/hooks/ClientCustomHooks"
import { useNavigate } from "react-router-dom"
import singupImg from "@/assets/images/vendorsupimg.webp"

// Define your interface types
interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: string;
  document: File | null;
}

interface VendorData {
  name: string;
  email: string;
  idProof: string;
  password: string;
  phone: string;  
  role: string;
  confirmPassword: string;
}

// Define validation schema using Yup
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Please enter a valid email").required("Email is required"),
  phone: Yup.string().matches(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number").required("Phone is required"),
  password: Yup.string()
    .transform((value) => value?.trim()) // Remove leading/trailing spaces
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .transform((value) => value?.trim()) // Remove leading/trailing spaces
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  document: Yup.mixed().required("Document is required")
})

const initialValues: FormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  role: "vendor",
  document: null,
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [_showCropper, setShowCropper] = useState<boolean>(false)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<VendorData>()

 const uploadImageCloudinaryAPI = useUploadeImageToCloudinaryMutation()
 const vendorSignupAPI = useVendorSignupMutation()
 const vendorCreateAccount = useCreateAccountMutation()
 const vendorResendOtp = useResendOtpClientMutaion()
 const navigate = useNavigate()
 


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

  const handleSubmit = async (values: FormValues) => {
    const fileToUpload = croppedImage || values.document;
    if (!fileToUpload) {
      toast.error('Please select an ID Proof')
      throw new Error("No file selected")
    }

    const formdata = new FormData()
    formdata.append('file', fileToUpload)
    formdata.append('upload_preset', 'vendor_id')
    
    try {
      const response = await uploadImageCloudinaryAPI.mutateAsync(formdata)
      // const documentUrl = response.secure_url
      const fullUrl = response.secure_url;
      const documentUrl = new URL(fullUrl).pathname.split("/image/upload/")[1];

      
      const vendor: VendorData = {
        name: values.name,
        email: values.email,
        idProof: documentUrl,
        password: values.password,
        phone: values.phone,
        role:'vendor',
        confirmPassword: values.confirmPassword
      }
      
      setData(vendor)
      
      // Call the vendor signup API
      vendorSignupAPI.mutate(vendor, {
        onSuccess: () => {
          setIsOpen(true)
        },
        onError: (error) => {
          toast.error(error?.message)
        }
      })

    } catch (error) {
        console.log(error)
    }
  }

  
  const handleSuccess = () => {
        setIsOpen(false)
        toast.success('Account created')
        setTimeout(() => {
          navigate("/vendor/login")
        }, 3000);
        
    }



const handleError = (error: unknown) => {
        if (error instanceof Error) {
            toast.error(error.message)
        }
    }





  // Uncomment this when you implement the image cropper
  /*
  const handleCrop = (croppedFile) => {
    setCroppedImage(croppedFile)
    setShowCropper(false)
  }
  */

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 ">
      <div className="w-full overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex h-full flex-col md:flex-row">
          <motion.div
            className="w-full p-8 md:w-1/2 md:p-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
              {/* <Logo /> */}
            </motion.div>

            <div className="flex flex-col items-center justify-center">
              <motion.h1 variants={itemVariants} className="mb-2 text-3xl font-bold">
              Join as a Vendor
              </motion.h1>
              <motion.p variants={itemVariants} className="mb-6 text-muted-foreground">
              Sign up to showcase your services and start receiving event bookings
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="relative mb-2 flex items-center justify-center">
              <div className="h-px flex-grow bg-gray-200"></div>
              <span className="mx-4 text-sm text-muted-foreground">or</span>
              <div className="h-px flex-grow bg-gray-200"></div>
            </motion.div>

            <div className="mx-auto flex w-full max-w-md justify-center">
              <Formik
                initialValues={initialValues}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="w-full space-y-4">
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name<span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        className="mt-1 h-11 rounded-full"
                      />
                      <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-1 h-11 rounded-full"
                      />
                      <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-500" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </Label>
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        className="mt-1 h-11 rounded-full"
                      />
                      <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-500" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password<span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-1">
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-11 rounded-full pr-10"
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
                      <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-500" />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password<span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-1">
                        <Field
                          as={Input}
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="h-11 rounded-full pr-10"
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
                      <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-500" />
                    </motion.div>
                    
                   
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="document" className="text-sm font-medium">
                        Upload Document<span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-1">
                        <label
                          htmlFor="document"
                          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-sm text-gray-600 transition-all duration-200 hover:border-purple-400 hover:bg-purple-50 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-purple-600"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17,8 12,3 7,8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                          </svg>
                          {values.document ? (
                            <span className="font-medium text-purple-700">{values.document.name}</span>
                          ) : (
                            <span>Choose ID Proof Document</span>
                          )}
                        </label>
                        <input
                          id="document"
                          name="document"
                          type="file"
                          accept="image/jpeg, image/png, application/pdf"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) {
                              setFieldValue("document", file)
                              setCroppedImage(file) // Set cropped image to the original file for now

                              const fileType = file.type
                              if (fileType.startsWith("image/")) {
                                setSelectedImage(URL.createObjectURL(file))
                                // setShowCropper(true); // Uncomment if you want to implement cropper
                              } else {
                                setSelectedImage("")
                                setShowCropper(false)
                              }
                            }
                          }}
                        />
                      </div>
                      <ErrorMessage name="document" component="p" className="mt-1 text-sm text-red-500" />
                    </motion.div>
                    {selectedImage && (
                      <div className="mt-3 flex items-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-md border border-gray-200 shadow-sm">
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Document Preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-xs text-white">
                            Preview
                          </div>
                        </div>
                        <div className="ml-4 text-sm text-gray-600">
                          <p className="font-medium">Document uploaded</p>
                          <p className="mt-1 text-xs">Click the upload button to change</p>
                        </div>
                      </div>
                    )}

                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        className="mt-6 h-12 w-full rounded-full bg-purple-600 text-white hover:bg-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                      </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
                      Already have an account?{" "}
                      <a href="/vendor/login" className="font-medium text-purple-600 hover:underline">
                        Log in
                      </a>
                    </motion.div>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            className="hidden bg-purple-600 md:block md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${singupImg})` }}
              ></div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-12 text-white">
                <motion.h2
                  className="mb-4 text-4xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  Grow Your Business.
                  <br />
                 Connect with Event Planners.
                  </motion.h2>
                <motion.p
                  className="mb-8 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  Join our platform to get discovered by thousands of event organizers.
                  <br />
                  Showcase your services, manage bookings, and expand your reach.
                  </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="flex items-center space-x-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
                    <Check className="h-5 w-5" />
                    <span>Verified Vendor Platform</span>
                  </div>
                  <div className="flex items-center space-x-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
                    <Truck className="h-5 w-5" />
                    <span>Get More Leads & Bookings</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <OTPModal isOpen={isOpen} data={data}   handleError={handleError} resendOtp={vendorResendOtp} mutation={vendorCreateAccount} email={data?.email} handleSuccess={handleSuccess} setIsOpen={setIsOpen}  />
    </div>
  )
}