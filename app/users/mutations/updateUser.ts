import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateUser = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  county: z.string(),
  companyName: z.string(),
  taxId: z.string(),
  birth: z.string().nullable().optional(),
  cellphone: z.string().nullable().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateUser),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const user = await db.User.update({ where: { id }, data })

    return user
  }
)
