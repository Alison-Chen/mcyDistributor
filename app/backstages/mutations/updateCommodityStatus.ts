import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const updateCommodityOrderStatus = z.object({
  uuid: z.string(),
  status: z.string(),
})

export default resolver.pipe(resolver.zod(updateCommodityOrderStatus), async ({ uuid, status }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const updateCommodityStatus = await db.commodityOrder.update({
    where: { uuid },
    data: { status },
  })

  return updateCommodityStatus
})
