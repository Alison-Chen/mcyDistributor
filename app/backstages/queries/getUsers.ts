import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(data, { session }: Ctx) {
  const user = await db.user.findMany({
    where: data,
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
      archived: true,
    },
  })

  return user
}
