import { configureStore, combineReducers } from '@reduxjs/toolkit';

import todo from './todo/slice';

const reducer = combineReducers({ todo });

const store = configureStore({ reducer });

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
