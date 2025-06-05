import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

  export const getActiveSession = createSelector(
	(state: RootState) => state.client.client,
	(state: RootState) => state.vendor.vendor,
	(state: RootState) => state.admin.admin,
	(client, vendor, admin) => {
		if (client) return { role: client.role, type: "client" };
		if (vendor) return { role: vendor.role, type: "vendor" };
		if (admin) return { role: admin.role, type: "admin" };
		return null;
	}
);