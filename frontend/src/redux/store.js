import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
  company: companySlice,
  application: applicationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
