import { createSlice, PayloadAction, current } from "@reduxjs/toolkit"

import { DefaultRootState } from "react-redux"
import get from "lodash/get"
import map from "lodash/map"
import set from "lodash/set"
import cloneDeep from "lodash/cloneDeep"

interface Props {
  shopList: any
}

export const shoplistSlice = createSlice({
  name: "shoplistReducer",
  initialState: <Props>{
    shoplist: "",
  },
  reducers: {
    setSchema(state, action: PayloadAction) {
      state.shoplist = Object.assign([], state.shoplist, action?.payload)
      return state
    },
    deleteSchema(state, action: PayloadAction) {
      const currentState = cloneDeep(current(state))
      console.log(currentState?.shoplist, "currentState")
      currentState?.shoplist?.splice(action.payload, 1)

      return currentState
    },
    deleteAllSchema(state, action: PayloadAction) {
      state.shoplist = []
      return state
    },
  },
})

/** action */
export const shoplistAction = shoplistSlice.actions

/** reducer */
export const shoplistReducer = shoplistSlice.reducer

export const shoplistSelector = {
  getShoplist: (state: DefaultRootState): Props => {
    return state?.[shoplistSlice.name]?.shoplist
  },
}
