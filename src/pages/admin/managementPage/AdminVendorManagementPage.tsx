// import { useState, useEffect, useMemo } from "react";
// import { debounce } from "lodash";
// import { useGetAllUsers, useUpdateUserStatusMutaiion } from "@/hooks/AdminCustomHooks";
// import { VendorManagementComponent } from "@/components/admin/mangement/VendorMangement";
// import toast from "react-hot-toast";
// import { IVendor } from "@/types/User";

// export default function AdminVendorManagementPage() {
// 	const [searchQuery, setSearchQuery] = useState("");
// 	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [vendors, setVendors] = useState<IVendor[]>([]);
// 	const limit = 10;

//  const {mutate: updateUserStatus} = useUpdateUserStatusMutaiion()
// 	// const { errorToast, successToast } = useToaster();

	
// 	const debouncedUpdate = useMemo(() => {
// 		return debounce((value: string) => {
// 			setDebouncedSearch(value);
// 		}, 1000);
// 	}, []);


	
// 	useEffect(() => {
// 		debouncedUpdate(searchQuery);
// 		return () => {
// 			debouncedUpdate.cancel();
// 		};
// 	}, [searchQuery, debouncedUpdate]);

	
// 	const { data, isLoading, isError } = useGetAllUsers({
// 		page:currentPage,
// 		limit,
// 		search:debouncedSearch,
// 		userType:"vendor"
// 	});
	

// 	useEffect(() => {
// 		if (data?.users) {
// 			setVendors(data.users);
// 		}
// 	}, [data]);

// 	const totalPages = data?.totalPages || 1;

// 	const handleStatusClick = async (userId: string) => {
// 		try {
// 			await updateUserStatus(
// 				{
// 					userType: "vendor",
// 					userId,
// 				},
// 				{
// 					onSuccess: (data) => {
// 						toast.success(data.message);
// 						setVendors((prevVendors) =>
// 							prevVendors.map((vendor) =>
// 								vendor.userId === userId
// 									? ({ ...vendor, status: vendor.status === "active" ? "inactive" : "active" }as IVendor)
// 									: vendor
// 							)
// 						);
// 					},
// 					onError: (error) => {
// 						toast.error(error.message);
// 					},
// 				}
// 			);
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	};

// 	return (
// 		<VendorManagementComponent
// 			vendor={vendors}
// 			totalPages={totalPages}
// 			currentPage={currentPage}
// 			isLoading={isLoading}
// 			isError={isError}
// 			searchQuery={searchQuery}
// 			onSearchChange={setSearchQuery}
// 			onPageChange={setCurrentPage}
// 			onStatusUpdate={handleStatusClick}
// 		/>
// 	);
// };


import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { VendorManagementComponent } from "@/components/admin/mangement/VendorMangement";
import { useGetAllUsers, useUpdateUserStatusMutaiion } from "@/hooks/AdminCustomHooks";
import toast from "react-hot-toast";
import { IVendor } from "@/types/User";

export default function AdminVendorManagementPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const [vendors, setVendors] = useState<IVendor[]>([]);
	const [activeTab, setActiveTab] = useState<"active" | "blocked">("active");

	const limit = 10;

	const { mutate: updateUserStatus } = useUpdateUserStatusMutaiion();

	const debouncedUpdate = useMemo(() => {
		return debounce((value: string) => {
			setDebouncedSearch(value);
		}, 1000);
	}, []);

	useEffect(() => {
		debouncedUpdate(searchQuery);
		return () => {
			debouncedUpdate.cancel();
		};
	}, [searchQuery, debouncedUpdate]);

	const { data, isLoading, isError } = useGetAllUsers({
		page: currentPage,
		limit,
		search: debouncedSearch,
		userType: "vendor",
	});

	useEffect(() => {
		if (data?.users) {
			setVendors(data.users);
		}
	}, [data]);

	const totalPages = data?.totalPages || 1;

	const handleStatusClick = async (userId: string) => {
		try {
			await updateUserStatus(
				{ userType: "vendor", userId },
				{
					onSuccess: (data) => {
						toast.success(data.message);
						setVendors((prevVendors) =>
							prevVendors.map((vendor) =>
								vendor.userId === userId
									? ({
											...vendor,
											status: vendor.status === "active" ? "blocked" : "active",
									  } as IVendor)
									: vendor
							)
						);
					},
					onError: (error) => {
						toast.error(error.message);
					},
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

	const filteredVendors = useMemo(() => {
		return vendors.filter((vendor) => vendor.status === activeTab);
	}, [vendors, activeTab]);

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Vendor Management</h1>
			</div>

			<div className="flex space-x-4 mb-4">
				<button
					onClick={() => setActiveTab("active")}
					className={`px-4 py-2 rounded ${
						activeTab === "active" ? "bg-green-600 text-white" : "bg-gray-300"
					}`}
				>
					Active Vendors
				</button>
				<button
					onClick={() => setActiveTab("blocked")}
					className={`px-4 py-2 rounded ${
						activeTab === "blocked" ? "bg-red-600 text-white" : "bg-gray-300"
					}`}
				>
					Blocked Vendors
				</button>
			</div>

			<VendorManagementComponent
				vendor={filteredVendors}
				totalPages={totalPages}
				currentPage={currentPage}
				isLoading={isLoading}
				isError={isError}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onPageChange={setCurrentPage}
				onStatusUpdate={handleStatusClick}
			/>
		</div>
	);
}
