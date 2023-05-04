import { SecurePassword } from "@blitzjs/auth"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Role } from "types"
import { Signup } from "../validations"
import { Ctx } from "blitz"

export default resolver.pipe(resolver.zod(Signup), async ({ name, lineId }, ctx: Ctx) => {
  const user = await db.user.findFirst({ where: { lineId } })
  if (user) {
    await ctx.session.$create({ userId: user.id, role: user.role as Role })
    return user
  }

  if (!user) {
    const user = await db.user.create({
      data: { lineId, name, role: "USER" },
      select: { id: true, name: true, email: true, role: true },
    })
    await ctx.session.$create({ userId: user.id, role: user.role as Role })
    return user
  }
})
