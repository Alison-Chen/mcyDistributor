import { useQuery } from "@blitzjs/rpc"
import getShopList from "app/shopList/queries/getShopList"

export const useShoplist = () => {
  const [shopList] = useQuery(getShopList, null)
  return shopList
}
