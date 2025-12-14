/*
import {configreStore} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload)
    }
  }
})

const store = configreStore({
  reducer: {
    user: userSlice.reducer
  }
})
export default store */
/*
import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { addUser } = userSlice.actions; // ✅ export action

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;
*/

import { configureStore, createSlice } from "@reduxjs/toolkit";

// ⭐ Step 1: Read user from localStorage
const savedUser = localStorage.getItem("user");
const initialUser = savedUser ? JSON.parse(savedUser) : {}; 

const userSlice = createSlice({
  name: "user",
  initialState: initialUser,   // ⭐ Step 2: Use the restored user here
  reducers: {
    addUser: (state, action) => {
      // When user logs in
      localStorage.setItem("user", JSON.stringify(action.payload)); // ⭐ Save to localStorage
      return action.payload;
    },
    removeUser: () => {
      // When user logs out
      localStorage.removeItem("user");  // ⭐ Remove from localStorage
      return {};
    }
  }
});

export const { addUser, removeUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;
