import { store } from "data/store"
import forEachObjIndexed from "ramda/src/forEachObjIndexed"
import { JKObject } from "./interface/common"

import { actions } from "./slice"

const redux: JKObject = {}
forEachObjIndexed((f, k) => {
  redux[k] = (args) => store.dispatch(f(args))
}, actions)

export default redux
