// import { useState, useEffect, useMemo } from "react";
// import { debounce } from "lodash";
// // import { useToaster } from "@/hooks/ui/useToaster";
// import { ClientManagementComponent } from "@/components/admin/mangement/UserMangement";
// import { useGetAllUsers, useUpdateUserStatusMutaiion } from "@/hooks/AdminCustomHooks";
// import toast from "react-hot-toast";
// import { IClient } from "@/types/User";


// export default function AdminClientManagementPage() {
// 	const [searchQuery, setSearchQuery] = useState("");
// 	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [clients, setClients] = useState<IClient[]>([]);

// 	const limit = 10;

//  const { mutate: updateUserStatus} = useUpdateUserStatusMutaiion()


//  const debouncedUpdate = useMemo(() => {
// 	return debounce((value: string) => {
// 		setDebouncedSearch(value);
// 	}, 1000);
// }, []);



// useEffect(() => {
// 	debouncedUpdate(searchQuery);
// 	return () => {
// 		debouncedUpdate.cancel();
// 	};
// }, [searchQuery, debouncedUpdate]);



// 	const { data, isLoading, isError } = useGetAllUsers({
// 	  page:currentPage,
// 		limit,
// 		search: debouncedSearch,
// 		userType:"client"
// });


// useEffect(() => {
// 	if (data?.users) {
// 		setClients(data.users);
// 	}
// }, [data]);

// 	const totalPages = data?.totalPages || 1;

// 	const handleStatusClick = async (userId: string) => {
// 		try {
// 			await updateUserStatus(
// 				{
// 					userType: "client",
// 					userId,
// 				},
// 				{
// 					onSuccess: (data) => {
// 						toast.success(data.message);
// 									setClients((prevClients) =>
// 										prevClients.map((client) =>
// 											client.userId === userId
// 												? ({
// 														...client,
// 														status: client.status === "active" ? "inactive" : "active",
// 													}as IClient)
// 												: client
// 										)
// 									);
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
// 		<ClientManagementComponent
// 			clients={clients}
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
import { ClientManagementComponent } from "@/components/admin/mangement/UserMangement";
import { useGetAllUsers, useUpdateUserStatusMutaiion } from "@/hooks/AdminCustomHooks";
import toast from "react-hot-toast";
import { IClient } from "@/types/User";

export default function AdminClientManagementPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const [clients, setClients] = useState<IClient[]>([]);
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
		userType: "client",
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
				{ userType: "client", userId },
				{
					onSuccess: (data) => {
						toast.success(data.message);
						setClients((prevClients) =>
							prevClients.map((client) =>
								client.userId === userId
									? ({
											...client,
											status: client.status === "active" ? "blocked" : "active",
									  } as IClient)
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
			console.log(error);
		}
	};

	// Filter clients by active/inactive tab
	const filteredClients = useMemo(() => {
		return clients.filter((client) => client.status === activeTab);
	}, [clients, activeTab]);

	return (
		<div className="p-4">
			  <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
			{/* Tab Buttons */}
			<div className="flex space-x-4 mb-4">
				<button
					onClick={() => setActiveTab("active")}
					className={`px-4 py-2 rounded ${
						activeTab === "active" ? "bg-blue-600 text-white" : "bg-gray-300"
					}`}
				>
					Active Users
				</button>
				<button
					onClick={() => setActiveTab("blocked")}
					className={`px-4 py-2 rounded ${
						activeTab === "blocked" ? "bg-red-600 text-white" : "bg-gray-300"
					}`}
				>
					Blocked Users
				</button>
			</div>

			{/* Render Table */}
			<ClientManagementComponent
				clients={filteredClients}
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
