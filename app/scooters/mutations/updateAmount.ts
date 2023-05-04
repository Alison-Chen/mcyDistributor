// TODO:減去amount
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const orderAmount = z.object({
  id: z.string(),
  amount: z.number(),
})

export default resolver.pipe(resolver.zod(orderAmount), async ({ id, amount }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const orderAmount = await db.orderAmount.update({
    where: { uuid },
    data: { email, name, taxId, address, phone, logisticOrderId },
  })

  return orderAmount
})
