import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProduct = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number(),
})

export default async function getProduct({ id }, { session }: Ctx) {
  if (!session.userId) return null

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const product = await db.product.findFirst({ where: { id } })
  const colorInfo = await db.productColor.findMany({ where: { productId: id } })

  if (product) {
    product.colorInfo = colorInfo
  }

  if (!product) throw new NotFoundError()

  return product
}
