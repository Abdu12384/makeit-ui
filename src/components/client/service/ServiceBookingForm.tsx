import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Calendar, Mail, Phone, IndianRupee, Clock, Award, AlertCircle } from 'lucide-react';
import { useBookingServiceMutation } from '@/hooks/ClientCustomHooks';

interface BookingFormProps {
  serviceId: string;
  vendorId: string;
  servicePrice: number;
  serviceDuration: string;
  additionalHourFee: number;
  yearsOfExperience: number;
  cancellationPolicySnippet: string;
  onBookingSuccess: () => void;
}
interface BookingFormValues {
  email: string;
  phone: string;
  date: string;
}


export const BookingFormComponent: React.FC<BookingFormProps> = ({
  serviceId,
  vendorId,
  servicePrice,
  serviceDuration,
  additionalHourFee,
  yearsOfExperience,
  cancellationPolicySnippet,
  onBookingSuccess,
}) => {
  const clientBookingServiceMutation = useBookingServiceMutation();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    date: Yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
  });

  const handleBookingSubmit = (values: BookingFormValues, action: FormikHelpers<BookingFormValues>) => {
    clientBookingServiceMutation.mutate(
      {
        id: serviceId,
        bookingData: {
          email: values.email,
          phone: values.phone,
          date: values.date,
          vendorId: vendorId,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          action.resetForm();
          action.setSubmitting(false);
          onBookingSuccess(); 
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to book service. Please try again.');
          action.setSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      {/* Service Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <IndianRupee className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-2xl font-bold text-gray-800">₹{servicePrice}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-1" />
            <span>{serviceDuration}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Duration</h4>
              <p className="text-sm text-gray-600">{serviceDuration}</p>
            </div>
          </div>
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Additional Hour</h4>
              <p className="text-sm text-gray-600">₹{additionalHourFee} per hour</p>
            </div>
          </div>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Experience</h4>
              <p className="text-sm text-gray-600">{yearsOfExperience} years</p>
            </div>
          </div>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Cancellation</h4>
              <p className="text-sm text-gray-600">{cancellationPolicySnippet}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <Formik
        initialValues={{ email: '', phone: '', date: '' }}
        validationSchema={validationSchema}
        onSubmit={handleBookingSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 mr-1" />
                Phone Number
              </label>
              <Field
                type="tel"
                name="phone"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Preferred Date
              </label>
              <Field
                type="date"
                name="date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isSubmitting ? 'Booking...' : 'Book Now'}
            </motion.button>
          </Form>
        )}
      </Formik>
    </div>
  );
};