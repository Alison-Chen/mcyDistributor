import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      city: true,
      county: true,
      companyName: true,
      phone: true,
      taxId: true,
      review: true,
      cellphone: true,
      birth: true,
    },
  })

  return user
}
