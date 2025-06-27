import { useMemo, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, Save, X, Edit3, Award, Phone, Mail, User, KeyRound } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/store"
import dummyDP from "@/assets/images/profile-img.jpg"
import { useUpdateVendorProfileMutation, useUploadeImageToCloudinaryMutation } from "@/hooks/VendorCustomHooks"
import { vendorLogin } from "@/store/slices/vendor.slice"
import { IVendor } from "@/types/User"
import toast from "react-hot-toast"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { ChangePassword } from "@/components/common/changePassword/ChangePassword"


const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed")
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
    .required("Contact number is required"),

  emailAddress: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  aboutVendor: Yup.string()
    .max(500, "About section must be under 500 characters")
    .nullable(),
});


const colors = {
  white: "#FFFFFF",
  lightGray: "#F5F7FA",
  mediumGray: "#E4E7EB",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  accent: "#3182CE",
  error: "#E53E3E",
}

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const { vendor } = useSelector((state: RootState) => state.vendor)
  const dispatch = useDispatch()

  const updateVendorMutaion = useUpdateVendorProfileMutation()
  const uploadToCloudinaryMutation = useUploadeImageToCloudinaryMutation()

  const initialValues = useMemo(()=>({
    name: vendor?.name || "",
    contactNumber: vendor?.phone || "",
    emailAddress: vendor?.email || "",
    aboutVendor: vendor?.aboutVendor || "",
    profileImage: vendor?.profileImage || dummyDP
  }),[vendor]);


    const changePasswordRef = useRef<HTMLDivElement>(null)
  

  const handleSave = async (values: typeof initialValues) => {
    console.log(`handleSave is running with ${JSON.stringify(values)}`) // [CHANGED! (added log)]
    setIsEditing(false)

    try {
      let profileImageUrl = vendor?.profileImage

      if (
        values.profileImage &&
        values.profileImage !== vendor?.profileImage &&
        values.profileImage !== dummyDP
      ) {
        const imageBlob = await fetch(values.profileImage).then(r => r.blob())
        const imageFile = new File([imageBlob], "profile-image.jpg", { type: "image/jpeg" })

        const cloudinaryFormData = new FormData()
        cloudinaryFormData.append("file", imageFile)
        cloudinaryFormData.append("upload_preset", "vendor_id")

        const uploadResponse = await uploadToCloudinaryMutation.mutateAsync(cloudinaryFormData)
        profileImageUrl = uploadResponse.secure_url
      }

      const updatedVendorData = {
        name: values.name,
        phone: values.contactNumber,
        email: values.emailAddress,
        aboutVendor: values.aboutVendor,
        profileImage: profileImageUrl ?? ""
      }

      await updateVendorMutaion.mutate(
        { data: updatedVendorData },
        {
          onSuccess: (response) => {
            const user = response.data.user
            dispatch(vendorLogin(user as IVendor))
            toast.success(response.data.message)
          },
          onError: (error) => {
            console.log("Profile Updating Error", error)
          }
        }
      )
    } catch (error) {
      console.log(error)
    }

    console.log(`handleSave is returning updated vendor`) // [CHANGED! (log completion)]
  }

  const formFields = [
    { id: "name", label: "Name", type: "text", icon: <User className="h-4 w-4" /> },
    {
      id: "contactNumber",
      label: "Contact Number",
      type: "tel",
      icon: <Phone className="h-4 w-4" />,
    },
    {
      id: "emailAddress",
      label: "Email Address",
      type: "email",
      icon: <Mail className="h-4 w-4" />,
      readOnly: true
    },
    {
      id: "aboutVendor",
      label: "About Me",
      type: "textarea",
      icon: <Edit3 className="h-4 w-4" />,
    },
  ]




    useEffect(() => {
      if (showChangePassword && changePasswordRef.current) {
        setTimeout(() => {
          changePasswordRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          })
        }, 100)
      }
    }, [showChangePassword])
  


  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }
  return (
    <>
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Form submission triggered with values:", values); 
        handleSave(values).finally(() => setSubmitting(false));
      }}     
       validationSchema={validationSchema}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.1 } }
            }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-5xl mx-auto"
          >
            <div className="relative p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <motion.div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
                  <Award className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">Vendor Profile</h1>
              </motion.div>
              <motion.div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    type="button"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      type="button"
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="p-6 relative">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <motion.div className="h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <img
                      src={values.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {isEditing && (
                    <motion.div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white cursor-pointer hover:bg-primary/90">
                      <label htmlFor="profile-upload" className="cursor-pointer">
                        <Camera className="h-4 w-4" />
                        <input
                          id="profile-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                if (e.target?.result) {
                                  setFieldValue("profileImage", e.target.result)
                                }
                              }
                              reader.readAsDataURL(e.target.files[0])
                            }
                          }}
                        />
                      </label>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {formFields.map((field) => (
                <div key={field.id} className={`bg-white rounded-lg border border-gray-200 ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center">
                    <div className="text-primary">{field.icon}</div>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 ml-2">{field.label}</label>
                  </div>
                  <div className="p-4">
                    {isEditing ? (
                      field.type === "select" ? (
                        <Field as="select" name={field.id} className="w-full text-black p-2 border border-gray-300 rounded-md">
                          <option value="">Select {field.label}</option>
                        </Field>
                      ) : field.type === "textarea" ? (
                        <Field as="textarea" name={field.id} rows={4} className="w-full p-2 border border-gray-300 rounded-md" />
                      ) : (
                        <Field type={field.type} name={field.id} readOnly={field.id === "emailAddress"} className="w-full p-2 border border-gray-300 rounded-md" />
                      )
                    ) : (
                      <div className="p-2 rounded-md text-gray-700 min-h-[40px]">
                        {values[field.id as keyof typeof values] || <span className="text-gray-400 text-sm italic">Not specified</span>}
                      </div>
                    )}
                    {/* Display validation error */}
                    <div className="text-red-500 text-sm mt-1">
                      <ErrorMessage name={field.id} />
                    </div>
                  </div>
                </div>
              ))}
              </div>
              {!isEditing && (
                <motion.div variants={itemVariants} className="mt-8 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChangePassword(true)}
                    type="button"
                    className="px-40  py-2 rounded-lg text-white font-medium flex items-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </motion.button>
                </motion.div>
                )}
            </div>
          </motion.div>
        </Form>
      )}
    </Formik>
    {showChangePassword && (
        <div ref={changePasswordRef}>
           <ChangePassword 
            onClose={() => setShowChangePassword(false)} 
            isVendor={true} 
           />
        </div>
      )} 
    </>
  )
}
