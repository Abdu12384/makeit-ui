import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
// import { useToaster } from "@/hooks/ui/useToaster";
import { ClientManagementComponent } from "@/components/admin/mangement/UserMangement";
import { useGetAllUsers, useUpdateUserStatusMutaiion } from "@/hooks/AdminCustomHooks";
import toast from "react-hot-toast";
import { IClient } from "@/types/User";


export default function AdminClientManagementPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const [clients, setClients] = useState<IClient[]>([]);

	const limit = 10;

 const { mutate: updateUserStatus} = useUpdateUserStatusMutaiion()


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
		search: debouncedSearch,
		userType:"client"
});


useEffect(() => {
	if (data?.users) {
		setClients(data.users);
	}
}, [data]);

	const totalPages = data?.totalPages || 1;

	const handleStatusClick = async (userId: string) => {
		try {
			await updateUserStatus(
				{
					userType: "client",
					userId,
				},
				{
					onSuccess: (data) => {
						toast.success(data.message);
									setClients((prevClients) =>
										prevClients.map((client) =>
											client.userId === userId
												? ({
														...client,
														status: client.status === "active" ? "inactive" : "active",
													}as IClient)
												: client
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
		<ClientManagementComponent
			clients={clients}
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
