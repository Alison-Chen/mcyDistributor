import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateOrder = z.object({
  phone: z.string(),
  email: z.string(),
  taxId: z.string(),
  address: z.string(),
  name: z.string(),
  shoplist: z.string(),
  userId: z.number(),
  price: z.number(),
  mark: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateOrder),
  resolver.authorize(),
  async ({ name, phone, email, taxId, address, shoplist, userId, price, mark }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const uuid = Date.now().toString()
    const Order = await db.commodityOrder.create({
      data: { name, uuid, phone, email, taxId, address, shoplist, userId, price, mark },
    })

    return Order
  }
)
