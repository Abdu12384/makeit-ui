import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { VendorApplicationList } from "@/components/admin/application/AdminVendorApplication";
import { useAllVendorQueryMutation, useUpdateVendorStatusMutation } from "@/hooks/AdminCustomHooks";
import { getAllVendors } from "@/services/admin/adminService";
import toast from "react-hot-toast";

export default function AdminVendorApplicationPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const limit = 10;

	const debouncedHandleSearch = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedSearch(query);
      }, 1000),
    []
  );

  // ✅ Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);



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
    debouncedHandleSearch(query); 
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
