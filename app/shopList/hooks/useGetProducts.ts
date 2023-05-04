import { useQuery } from "@blitzjs/rpc"
import getProducts from "app/scooters/queries/getProducts"

export const useGetProducts = () => {
  const [user] = useQuery(getProducts, null)
  return user
}
