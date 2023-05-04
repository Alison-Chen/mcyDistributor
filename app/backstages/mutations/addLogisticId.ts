import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const commodityOrder = z.object({
  uuid: z.string(),
  logisticOrderId: z.string(),
})

export default resolver.pipe(resolver.zod(commodityOrder), async ({ uuid, logisticOrderId }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const commodityOrder = await db.commodityOrder.update({
    where: { uuid },
    data: { logisticOrderId, status: "DELIVER" },
  })

  return commodityOrder
})
