import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { VendorApplicationList } from "@/components/admin/application/AdminVendorApplication";
import { useAllVendorQueryMutation, useUpdateVendorStatusMutation } from "@/hooks/AdminCustomHooks";
import { getAllVendors } from "@/services/admin/adminService";
import toast from "react-hot-toast";

export function AdminVendorApplicationPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const limit = 10;

	useEffect(() => {
		const handler = debounce(() => setDebouncedSearch(searchQuery), 300);
		handler();
		return () => handler.cancel();
	}, [searchQuery]);

	// const { errorToast, successToast } = useToaster();

	const { data, refetch, isLoading } = useAllVendorQueryMutation(
    getAllVendors,
		currentPage,
		limit,
		debouncedSearch,
		"pending"
	);
	const vendor = data?.vendor || [];
	const totalPages = data?.totalPages || 1;

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const {
		mutate: updateStatus,
		isError,
	} = useUpdateVendorStatusMutation();

	const handleUpdateStatus = async (
		vendorId: string,
		status: string,
		message?: string
	) => {
		await updateStatus(
			{ vendorId, status, message },
			{
				onSuccess: (data) => {
					toast.success(data.message);
					refetch()
				},
			}
		);
	};
	console.log('vendor--------',vendor)

	return (
		<VendorApplicationList
			vendor={vendor}
			totalPages={totalPages}
			currentPage={currentPage}
			isLoading= {isLoading}
      isError={isError}  
		  searchQuery={searchQuery}
			onSearchChange={handleSearchChange}
			onPageChange={handlePageChange}
			onUpdateStatus={handleUpdateStatus}
		/>
	);
}
