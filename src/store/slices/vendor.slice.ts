import { refreshVendorSession } from "@/services/vendor/vendorService";
import { IVendor } from "@/types/User";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface VendorState {
	vendor: IVendor | null;
}

const initialState: VendorState = {
	vendor: null,
};

export const refreshBarberSessionThunk = createAsyncThunk<
	{ user: IVendor },
	void,
	{ rejectValue: string }
>("barber/refreshSession", async (_, { rejectWithValue }) => {
	try {
		const { user } = await refreshVendorSession();
		const mappedVendor: IVendor = {
			userId: user.userId,
      name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			status: user.status,
			profileImage: user.profileImage ?? "",
			rejectionReason: (user as IVendor).rejectionReason ?? "",
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,

		};
		return { user: mappedVendor };
	} catch (err) {
		console.log(err);
		return rejectWithValue("Failed to refresh session");
	}
});

const vendorSlice = createSlice({
	name: "vendor",
	initialState,
	reducers: {
		vendorLogin: (state, action: PayloadAction<IVendor>) => {
			state.vendor = action.payload;
		},
		vendorLogout: (state) => {
			state.vendor = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(refreshBarberSessionThunk.fulfilled, (state, action) => {	
				state.vendor = action.payload.user;
			})
			.addCase(refreshBarberSessionThunk.rejected, (_, action) => {
				console.error(action.payload || "Session refresh failed");
			});
	},
});

export const { vendorLogin, vendorLogout } = vendorSlice.actions;
export default vendorSlice.reducer;
