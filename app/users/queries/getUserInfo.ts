import { Ctx } from "blitz"
import db from "db"

import moment from "moment"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const startOf = moment(new Date()).startOf("year").toISOString()
  const endOf = moment(new Date()).endOf("year").toISOString()

  const cost = await db.commodityOrder.findMany({
    where: { userId: session.userId, createdAt: { gte: startOf, lte: endOf } },
    select: { price: true },
  })

  const total = cost?.reduce(
    (accumulator, currentValue) => ({ price: accumulator?.price + currentValue?.price }),
    { price: 0 }
  )

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

  return { price: total?.price, ...user }
}
