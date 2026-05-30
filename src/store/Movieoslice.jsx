import { createSlice } from "@reduxjs/toolkit";

const initialState = { // use initialState with uppercase 'S'
  bannerData: [],
  imageURL :"",
}

export const Movieoslice = createSlice({
  name: 'movieo',
  initialState, // reference the corrected variable name
  reducers: {
    setBannerData: (state, action) => {
      state.bannerData = action.payload
    },
    setimageURL : (state , action) =>{
      state.imageURL = action.payload
    }
  }
})

export const { setBannerData , setimageURL} = Movieoslice.actions;

export default Movieoslice.reducer;
