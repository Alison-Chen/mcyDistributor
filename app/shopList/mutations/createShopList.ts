import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateShopList = z.object({
  amount: z.number(),
  assemble: z.string(),
  battery: z.string(),
  charger: z.boolean(),
  color: z.string(),
  model: z.string(),
  remark: z.string(),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateShopList),
  resolver.authorize(),
  async ({ amount, assemble, battery, charger, color, model, remark, userId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const shopList = await db.shopList.create({
      data: { amount, assemble, battery, charger, color, model, remark, userId },
    })

    return shopList
  }
)
