import { Ctx } from "blitz"
import db from "db"

export default async function getcommodities(uuid, { session }: Ctx) {
  const commodityOrder = await db.commodityOrder.findFirst({
    where: { uuid },
    select: {
      uuid: true,
      name: true,
      email: true,
      address: true,
      phone: true,
      taxId: true,
      logisticOrderId: true,
      mark: true,
    },
  })

  return commodityOrder
}
