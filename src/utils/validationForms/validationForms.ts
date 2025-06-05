export interface FormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (!/^[a-zA-Z\s]+$/.test(data.name.trim())) {
    errors.name = "Name must only contain letters and spaces";
  }

  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  // Phone validation (optional)
  if (data.phone) {
    if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    } else if (!/^([6-9]{1})[0-9]{9}$/.test(data.phone)) {
      errors.phone = "Phone number must start with 6, 7, 8, or 9";
    }
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else {
    const password = data.password;
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must include at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must include at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must include at least one number";
    } else if (!/[@$!%*?&]/.test(password)) {
      errors.password = "Password must include at least one special character (@$!%*?&)";
    }
  }

  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}


export function validateSingleField(name: keyof FormData, value: string, fullFormData?: FormData): string | undefined {
  // We build a dummy form object with existing formData or empty values
  const dummyData: FormData = {
    name: fullFormData?.name || "",
    email: fullFormData?.email || "",
    phone: fullFormData?.phone || "",
    password: fullFormData?.password || "",
    confirmPassword: fullFormData?.confirmPassword || "",
    [name]: value, // Override the current field with new value
  };

  const errors = validateForm(dummyData);
  return errors[name];
}





export const validateLoginSingleField = (name: "email" | "password", value: string): string => {
  switch (name) {
    case "email":
      if (!value.trim()) return "Email is required"
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return "Invalid email format"
      return ""

    case "password":
      if (!value.trim()) return "Password is required"
      if (value.length < 6) return "Password must be at least 6 characters"
      return ""

    default:
      return ""
  }
}






