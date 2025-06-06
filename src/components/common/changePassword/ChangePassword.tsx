
import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, EyeOff, Eye, Lock, Save, X, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useClientChangePasswordMutation } from "@/hooks/ClientCustomHooks";
import { useVendorChangePasswordMutation } from "@/hooks/VendorCustomHooks"; // Add vendor hook

// Color palette for white theme
const colors = {
  white: "#FFFFFF",
  lightGray: "#F5F7FA",
  mediumGray: "#E4E7EB",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  accent: "#3182CE",
  error: "#E53E3E",
};

const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

interface ChangePasswordProps {
  onClose: () => void;
  isVendor: boolean; // New prop to determine role
}

export const ChangePassword = ({ onClose, isVendor }: ChangePasswordProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Select mutation based on isVendor prop
  const clientChangePasswordMutation = useClientChangePasswordMutation();
  const vendorChangePasswordMutation = useVendorChangePasswordMutation();
  const changePasswordMutation = isVendor ? vendorChangePasswordMutation : clientChangePasswordMutation;

  const handlePasswordChange = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await changePasswordMutation.mutateAsync(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          onSuccess: (response) => {
            console.log(`${isVendor ? "Vendor" : "Client"} password changed successfully`, response);
            toast.success(response?.message || "Password changed successfully");
            onClose();
          },
          onError: (error: any) => {
            console.error(`Error changing ${isVendor ? "vendor" : "client"} password:`, error);
            toast.error(error?.response?.data?.message || "Failed to change password");
          },
        }
      );
    } catch (error) {
      console.error(`Error changing ${isVendor ? "vendor" : "client"} password:`, error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="max-w-3xl mx-auto mt-6"
    >
      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: colors.white,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          borderRadius: "16px",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: colors.accent }}
            >
              <KeyRound className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Change Password
            </h2>
          </div>
          <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={passwordValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handlePasswordChange(values)
              .catch((error) => console.error(`Error changing ${isVendor ? "vendor" : "client"} password:`, error))
              .finally(() => setSubmitting(false));
          }}
        >
          {() => (
            <Form className="space-y-5">
              {/* Current Password */}
              <div className="rounded-lg p-5" style={{ backgroundColor: colors.lightGray }}>
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 mr-2" style={{ color: colors.accent }} />
                  <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Current Password
                  </label>
                </div>
                <div className="relative">
                  <Field
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    className="w-full px-3 py-2 rounded-lg pr-10"
                    style={{
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.mediumGray}`,
                      color: colors.textPrimary,
                    }}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <ErrorMessage name="currentPassword">
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

              {/* New Password */}
              <div className="rounded-lg p-5" style={{ backgroundColor: colors.lightGray }}>
                <div className="flex items-center mb-2">
                  <KeyRound className="h-5 w-5 mr-2" style={{ color: colors.accent }} />
                  <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    New Password
                  </label>
                </div>
                <div className="relative">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    className="w-full px-3 py-2 rounded-lg pr-10"
                    style={{
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.mediumGray}`,
                      color: colors.textPrimary,
                    }}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <ErrorMessage name="newPassword">
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

              {/* Confirm Password */}
              <div className="rounded-lg p-5" style={{ backgroundColor: colors.lightGray }}>
                <div className="flex items-center mb-2">
                  <KeyRound className="h-5 w-5 mr-2" style={{ color: colors.accent }} />
                  <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Confirm New Password
                  </label>
                </div>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.mediumGray}`,
                    color: colors.textPrimary,
                  }}
                  placeholder="Confirm your new password"
                />
                <ErrorMessage name="confirmPassword">
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

              {/* Password requirements */}
              <div
                className="text-xs p-4 rounded-lg"
                style={{ backgroundColor: colors.lightGray, color: colors.textSecondary }}
              >
                <p className="font-medium mb-2">Password requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Include at least one lowercase letter</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one number</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  type="button"
                  className="px-4 py-2 rounded-lg font-medium flex items-center"
                  style={{ backgroundColor: colors.mediumGray, color: colors.textPrimary }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={changePasswordMutation.isPending} // Use mutation's isLoading
                  className="px-4 py-2 rounded-lg text-white font-medium flex items-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  {changePasswordMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Password
                </motion.button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};