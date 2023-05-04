import { Ctx } from "blitz"
import db from "db"

export default async function getOrderlist({ uuid }, { session }: Ctx) {
  if (!session.userId) return null

  const orderlist = await db.commodityOrder.findFirst({ where: { uuid } })

  const shoplist = JSON.parse(orderlist?.shoplist)

  const productImage = await Promise.all(
    shoplist.map(async (item) => {
      return await db.productColor.findFirst({
        where: {
          productId: item.model,
          value: item.color,
        },
        select: {
          productId: true,
          imgUrl: true,
        },
      })
    })
  )

  const refineShoplist = shoplist.map((item, index) => ({
    ...item,
    imgUrl: productImage[index].imgUrl,
  }))

  return { ...orderlist, shoplist: refineShoplist }
}
