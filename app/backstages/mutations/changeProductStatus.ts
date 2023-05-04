import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const changeProductStatus = z.object({
  id: z.number(),
  status: z.boolean(),
})

export default resolver.pipe(resolver.zod(changeProductStatus), async ({ id, status }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const user = await db.product.update({ where: { id }, data: { status } })

  return user
})
