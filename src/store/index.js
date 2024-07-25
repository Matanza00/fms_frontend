// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// // import userReducer from "./userSlice";
// import authSlice from './authSlice';
// import companySlice from './companySlice';
// import { apiSlice } from '../services/apiSlice';

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'],
//   // blacklist: [],
// };

// // const customizedMiddleware = getDefaultMiddleware({
// //     serializableCheck: false
// //   })

// const persistedReducer = persistReducer(
//   persistConfig,
//   combineReducers({
//     auth: authSlice.reducer,
//     company: companySlice.reducer,
//     //   user: userReducer,
//   }),
// );

// const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     persistedReducer: persistedReducer,
//   },
// });

// export const persistor = persistStore(store);
// export default store;

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './authSlice';
import userSlice from './userSlice';
import companySlice from './companySlice';
import { apiSlice } from '../services/apiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

// Combine reducers including apiSlice.reducer and other reducers
const rootReducer = combineReducers({
  auth: authSlice,
  company: companySlice,
  user: userSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persistedReducer and apiSlice.middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Create persistor and setup listeners
export const persistor = persistStore(store);
setupListeners(store);

export default store;
