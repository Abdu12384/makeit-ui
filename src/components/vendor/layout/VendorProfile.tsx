import { motion } from "framer-motion";
import { Mail, Phone, Star, User } from "lucide-react";
import SimpleAppLayout from "./Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { vendorLogout } from "@/store/slices/vendor.slice";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";
import { useLogoutVendor } from "@/hooks/VendorCustomHooks";


const VendorProfile = () => {
 const dispatch = useDispatch()
  const { mutate: logout } = useLogoutVendor();



  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (data) => {
        setTimeout(() => {
          dispatch(vendorLogout())
        }, 2000);
				toast.success(data.message);
				// navigate("/admin");
			},
			onError: (err: any) => {
				toast.error(err.response.data.message);
			},
		});
	};

  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  

  console.log(vendor)

  return (
    <SimpleAppLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-600" />
            <CardHeader className="relative">
              <div className="absolute -top-12 left-6">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                  <User className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <div className="pt-14">
                <CardTitle>{vendor?.name}</CardTitle>
                <p className="text-sm text-gray-500">Premium Food & Beverage Vendor</p>
                <Button variant="outline" className="text-sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{vendor?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{vendor?.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4.0 Rating</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-purple-600" />
                  <span>Catering Services</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-purple-600" />
                  <span>Food Stations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-purple-600" />
                  <span>Beverage Service</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-purple-600" />
                  <span>Event Planning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SimpleAppLayout>
  );
};

export default VendorProfile;