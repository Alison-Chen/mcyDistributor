import { Ctx } from "blitz"
import db from "db"

export default async function getAllProducts(data, { session }: Ctx) {
  const products = await db.product.findMany({
    where: { type: "SCOOTER", ...data },
    select: {
      id: true,
      name: true,
      price: true,
      model: true,
      image: true,
    },
  })

  const productsColor = await db.productColor.findMany({
    select: {
      productId: true,
      value: true,
      label: true,
      amount: true,
    },
  })

  const refineProducts = products.map((item) => {
    const colors = productsColor.filter((color) => color.productId === item.id)
    return {
      ...item,
      color: colors,
    }
  })

  return refineProducts
}
