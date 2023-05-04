import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const commodityOrder = z.object({
  uuid: z.string(),
  email: z.string(),
  name: z.string(),
  taxId: z.string(),
  address: z.string(),
  phone: z.string(),
  logisticOrderId: z.string().nullable(),
})

export default resolver.pipe(
  resolver.zod(commodityOrder),
  async ({ uuid, email, name, taxId, address, phone, logisticOrderId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const commodityOrder = await db.commodityOrder.update({
      where: { uuid },
      data: { email, name, taxId, address, phone, logisticOrderId },
    })

    return commodityOrder
  }
)
