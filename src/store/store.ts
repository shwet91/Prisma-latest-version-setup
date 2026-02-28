import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import userReducer from "./features/userSlice";
import clientReducer from "./features/clientSlice";
import mealReducer from "./features/mealSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    clients: clientReducer,
    meal: mealReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
