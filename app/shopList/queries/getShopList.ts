import { Ctx } from "blitz"
import db from "db"

export default async function getShopList(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const shopList = await db.shopList.findMany({
    where: { userId: session.userId },
    select: { id: true, model: true, color: true, amount: true },
  })

  return shopList
}
