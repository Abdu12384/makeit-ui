import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
// import { useToaster } from "@/hooks/ui/useToaster";
import { useGetAllUsers, useUpdateUserStatusMutaiion } from "@/hooks/AdminCustomHooks";
import { IVendor } from "@/types/User";
import { VendorManagementComponent } from "@/components/admin/mangement/VendorMangement";
import toast from "react-hot-toast";

export const AdminVendorManagementPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 10;

 const {mutate: updateUserStatus} = useUpdateUserStatusMutaiion()
	// const { errorToast, successToast } = useToaster();

	useEffect(() => {
		const handler = debounce(() => setDebouncedSearch(searchQuery), 300);
		handler();
		return () => handler.cancel();
	}, [searchQuery]);

	const { data, isLoading, isError } = useGetAllUsers<IVendor>({
		page:currentPage,
		limit,
		search:debouncedSearch,
		userType:"vendor"
});

	const vendor = data?.users || [];
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
					},
					onError: (error: any) => {
						toast.error(error.response.data.message);
					},
				}
			);
		} catch (error: any) {
			toast.error(
				error.response?.data?.message || "Failed to update status."
			);
		}
	};

	return (
		<VendorManagementComponent
			vendor={vendor}
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
