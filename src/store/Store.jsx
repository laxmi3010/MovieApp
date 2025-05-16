import { configureStore } from '@reduxjs/toolkit'
import movieoReducer from './Movieoslice'

export const store = configureStore({
  reducer: {
    movieoData : movieoReducer
  },
})