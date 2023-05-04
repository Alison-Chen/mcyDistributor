import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const ReviewUser = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(ReviewUser), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const user = await db.User.update({ where: { id }, data: { archived: true } })

  return user
})
