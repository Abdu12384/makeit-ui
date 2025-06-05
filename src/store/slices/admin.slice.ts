import { refreshAdminSession } from "@/services/admin/adminService";
import { IAdmin } from "@/types/User";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
	admin: IAdmin | null;
  isLoggedIn: boolean | null
}

const initialState: AdminState = {
	admin: null,
  isLoggedIn : false
};

export const refreshAdminSessionThunk = createAsyncThunk<
	{ user: IAdmin },
	void,
	{ rejectValue: string }
>("admin/refreshSession", async (_, { rejectWithValue }) => {
	try {
		const { user } = await refreshAdminSession();

		const mappedAdmin: IAdmin = {
			userId: user.userId,
		  name: (user as IAdmin).name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			profileImage: user.profileImage ?? "",
			status: user.status,
			isSuperAdmin: (user as IAdmin).isSuperAdmin ?? false,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		return { user: mappedAdmin };
	} catch (err) {
		console.log(err);
		return rejectWithValue("Failed to refresh session");
	}
});

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		adminLogin: (state, action: PayloadAction<IAdmin>) => {
      state.admin = action.payload;
       state.isLoggedIn = true
		},
		adminLogout: (state) => {
			state.admin = null;
      state.isLoggedIn = false
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(refreshAdminSessionThunk.fulfilled, (state, action) => {
				state.admin = action.payload.user;
			})
			.addCase(refreshAdminSessionThunk.rejected, (_, action) => {
				console.error(action.payload || "Session refresh failed");
			});
	},
});

export const { adminLogin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
