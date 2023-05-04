import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

export default async function getProducts({ status, type = null }, { session }: Ctx) {
  if (!session.userId) return null
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  let products
  if (type) products = await db.product.findMany({ where: { status, type } })

  if (!type) products = await db.product.findMany({ where: { status } })

  if (!products) throw new NotFoundError()

  return products
}
