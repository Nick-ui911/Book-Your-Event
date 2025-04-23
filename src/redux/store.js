// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import eventsReducer from './eventsSlice';
import myeventsReducer from './myeventSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, // your slice here
    events: eventsReducer, // your slice here
    myEvents:myeventsReducer,
  },
});