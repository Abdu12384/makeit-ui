import { useMemo, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, Save, X, User, Phone, Mail, Loader2, KeyRound } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import dummyDP from "@/assets/images/profile-img.jpg"
import { useClientProfileEditMutation } from "@/hooks/ClientCustomHooks"
import { clientLogin } from "@/store/slices/client.slice"
import type { IClient } from "@/types/User"
import toast from "react-hot-toast"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useUploadeImageToCloudinaryMutation } from "@/hooks/VendorCustomHooks"
import { ChangePassword } from "@/components/common/changePassword/ChangePassword"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"
// Color palette for white theme
const colors = {
  white: "#FFFFFF",
  lightGray: "#F5F7FA",
  mediumGray: "#E4E7EB",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  accent: "#3182CE",
  error: "#E53E3E",
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
  .trim() 
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed")
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

phone: Yup.string()
  .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
  .required("Phone number is required"),
})

const ClientProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const { client } = useSelector((state: RootState) => state.client)
  const dispatch = useDispatch()

  const changePasswordRef = useRef<HTMLDivElement>(null)


  const updateClientMutation = useClientProfileEditMutation()
  const uploadToCloudinaryMutation = useUploadeImageToCloudinaryMutation()

  const initialValues = useMemo(
    () => ({
      name: client?.name || "",
      phone: client?.phone || "",
      emailAddress: client?.email || "",
      profileImage: client?.profileImage || dummyDP,
    }),
    [client],
  )

 
   
  const handleSave = async (values: typeof initialValues) => {
    
    try {
      let profileImageUrl = client?.profileImage
      
      if (values.profileImage && values.profileImage !== client?.profileImage && values.profileImage !== dummyDP) {
        const imageBlob = await fetch(values.profileImage).then((r) => r.blob())
        const imageFile = new File([imageBlob], "profile-image.jpg", { type: "image/jpeg" })
        
        const cloudinaryFormData = new FormData()
        cloudinaryFormData.append("file", imageFile)
        cloudinaryFormData.append("upload_preset", "vendor_id")
        
        const uploadResponse = await uploadToCloudinaryMutation.mutateAsync(cloudinaryFormData)
        profileImageUrl = uploadResponse.secure_url
      }
      let uniquePath = "";
      if (profileImageUrl?.startsWith("http")) {
        const url = new URL(profileImageUrl);
        uniquePath = url.pathname.split("/image/upload/")[1];
      } else {
        uniquePath = profileImageUrl || "";
      }
  

      const updatedClientData = {
        name: values.name,
        phone: values.phone,
        email: values.emailAddress,
        profileImage: uniquePath ?? "",
      }

      await updateClientMutation.mutate(updatedClientData, {
        onSuccess: (response) => {
          const user = response.user
          
          dispatch(clientLogin(user as IClient))
          toast.success(response.message)
          setIsEditing(false)
        },
        onError: (error) => {
          console.log("Profile Updating Error", error)
        },
      })
    } catch (error) {
      console.log(error)
    }
  }



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
          handleSave(values).finally(() => setSubmitting(false))
        }}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-3xl mx-auto"
              style={{
                backgroundColor: colors.white,
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Header */}
              <motion.div
                variants={itemVariants}
                className="p-8 flex justify-between items-center border-b"
                style={{ backgroundColor: colors.white, borderColor: colors.mediumGray }}
              >
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    Profile Information
                  </h1>
                </div>

                <div>
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      type="button"
                      className="px-4 py-2 rounded-lg text-white font-medium flex items-center"
                      style={{ backgroundColor: colors.accent }}
                    >
                      Edit Profile
                    </motion.button>
                  ) : (
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg text-white font-medium flex items-center"
                        style={{ backgroundColor: colors.accent }}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        type="button"
                        className="px-4 py-2 rounded-lg font-medium flex items-center"
                        style={{ backgroundColor: colors.mediumGray, color: colors.textPrimary }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Profile content */}
              <div className="p-8 bg-white">
                {/* Profile image */}
                <motion.div variants={itemVariants} className="flex justify-center mb-8">
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="h-32 w-32 rounded-full overflow-hidden border-4 bg-gray-100 flex items-center justify-center"
                      style={{ borderColor: colors.accent }}
                    >
                       {values.profileImage &&
                          (values.profileImage.startsWith("data:") ||
                            values.profileImage.startsWith("blob:") ||
                            (values.profileImage !== dummyDP && values.profileImage)) ? (
                            <img
                              src={
                                values.profileImage.startsWith("data:") || values.profileImage.startsWith("blob:")
                                  ? values.profileImage
                                  : `${CLOUDINARY_BASE_URL}${values.profileImage}`
                              }
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-16 h-16 text-gray-400" />
                          )}
                    </motion.div>
                    {isEditing && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 right-0 p-2 rounded-full text-white cursor-pointer"
                        style={{ backgroundColor: colors.accent }}
                      >
                        <label htmlFor="profile-upload" className="cursor-pointer">
                          <Camera className="h-5 w-5" />
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
                </motion.div>

                {/* Form fields */}
                <div className="space-y-6">
                  {/* Name field */}
                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg p-5"
                    style={{ backgroundColor: colors.lightGray }}
                  >
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 mr-2" style={{ color: colors.accent }} />
                      <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        Name
                      </label>
                    </div>
                    {isEditing ? (
                      <div>
                        <Field
                          type="text"
                          name="name"
                          className="w-full px-3 py-2 rounded-lg"
                          style={{
                            backgroundColor: colors.white,
                            border: `1px solid ${colors.mediumGray}`,
                            color: colors.textPrimary,
                          }}
                          placeholder="Enter your name"
                        />
                        <ErrorMessage name="name">
                          {(msg) => (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-1 text-xs"
                              style={{ color: colors.error }}
                            >
                              {msg}
                            </motion.div>
                          )}
                        </ErrorMessage>
                      </div>
                    ) : (
                      <div className="text-lg" style={{ color: colors.textPrimary }}>
                        {values.name || "Not specified"}
                      </div>
                    )}
                  </motion.div>

                  {/* Email field (non-editable) */}
                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg p-5"
                    style={{ backgroundColor: colors.lightGray }}
                  >
                    <div className="flex items-center mb-2">
                      <Mail className="h-5 w-5 mr-2" style={{ color: colors.accent }} />
                      <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        Email Address
                      </label>
                    </div>
                    <div className="text-lg" style={{ color: colors.textPrimary, opacity: 0.9 }}>
                      {values.emailAddress || "Not specified"}
                    </div>
                  </motion.div>

                  {/* Phone field */}
                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg p-5"
                    style={{ backgroundColor: colors.lightGray }}
                  >
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 mr-2" style={{ color: colors.accent }} />
                      <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                        Phone Number
                      </label>
                    </div>
                    {isEditing ? (
                      <div>
                        <Field
                          type="number"
                          name="phone"
                          className="w-full px-3 py-2 rounded-lg"
                          style={{
                            backgroundColor: colors.white,
                            border: `1px solid ${colors.mediumGray}`,
                            color: colors.textPrimary,
                          }}
                          placeholder="Enter your phone number"
                        />
                        <ErrorMessage name="phone">
                          {(msg) => (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-1 text-xs"
                              style={{ color: colors.error }}
                            >
                              {msg}
                            </motion.div>
                          )}
                        </ErrorMessage>
                      </div>
                    ) : (
                      <div className="text-lg" style={{ color: colors.textPrimary }}>
                        {values?.phone || "Not specified"}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Change Password Button */}
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

      {/* Render Change Password Component when button is clicked */}
      {showChangePassword && (
          <div ref={changePasswordRef}>
            <ChangePassword 
              onClose={() => setShowChangePassword(false)} 
              isVendor={false} 
              />
          </div>
        )}   
 </>
  )
}

export default ClientProfile