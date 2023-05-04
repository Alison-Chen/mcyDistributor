import { Ctx } from "blitz"
import db from "db"

export default async function getcommodities(data, { session }: Ctx) {
  if (data?.companyName) {
    const userId = await db.User.findFirst({
      where: { companyName: data.companyName },
      select: { id: true },
    })

    delete data.companyName
    if (userId?.id) {
      data.userId = userId.id
    } else {
      return []
    }
  }

  const commodityOrder = await db.commodityOrder.findMany({
    where: { ...data },
    select: {
      uuid: true,
      name: true,
      email: true,
      address: true,
      phone: true,
      taxId: true,
      createdAt: true,
      price: true,
      status: true,
      logisticOrderId: true,
      userId: true,
      mark: true,
    },
  })

  const refineCommodityOrder = await Promise.all(
    commodityOrder.map(async (item) => {
      const companyName = await db.User.findMany({
        where: { id: item.userId },
        select: {
          companyName: true,
        },
      })
      return { ...item, companyName: companyName[0].companyName }
    })
  )

  return refineCommodityOrder
}
