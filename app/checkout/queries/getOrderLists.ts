import { Ctx } from "blitz"
import db from "db"

export default async function getOrderlist({ id }, { session }: Ctx) {
  if (!session.userId) return null

  const orderlist = await db.commodityOrder.findMany({
    where: { userId: id },
    select: { id: true, uuid: true, createdAt: true, price: true, status: true },
  })

  return orderlist
}
