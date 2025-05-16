import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userDetails : null,
    isLoggedIn : false,
    token : null
};

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        setUserDetails : (state,action) => {
            state.userDetails = action.payload.userDetails;
            state.isLoggedIn = true;
            state.token = action.payload.token;
        },
        clearUserDetails : (state,action) => {
            state.userDetails = null;
            state.isLoggedIn = false;
            state.token = null;
        },

    }
});

export const {setUserDetails , clearUserDetails} = userSlice.actions;

export default userSlice.reducer;