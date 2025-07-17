import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useGetAllUsers, useUpdateUserStatusMutaiion } from "@/hooks/AdminCustomHooks";
import { VendorManagementComponent } from "@/components/admin/mangement/VendorMangement";
import toast from "react-hot-toast";
import { IVendor } from "@/types/User";

export default function AdminVendorManagementPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const [vendors, setVendors] = useState<IVendor[]>([]);
	const limit = 10;

 const {mutate: updateUserStatus} = useUpdateUserStatusMutaiion()
	// const { errorToast, successToast } = useToaster();

	
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
		page:currentPage,
		limit,
		search:debouncedSearch,
		userType:"vendor"
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
				{
					userType: "vendor",
					userId,
				},
				{
					onSuccess: (data) => {
						toast.success(data.message);
						setVendors((prevVendors) =>
							prevVendors.map((vendor) =>
								vendor.userId === userId
									? ({ ...vendor, status: vendor.status === "active" ? "inactive" : "active" }as IVendor)
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
			console.log(error)
		}
	};

	return (
		<VendorManagementComponent
			vendor={vendors}
			totalPages={totalPages}
			currentPage={currentPage}
			isLoading={isLoading}
			isError={isError}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
			onPageChange={setCurrentPage}
			onStatusUpdate={handleStatusClick}
		/>
	);
};
