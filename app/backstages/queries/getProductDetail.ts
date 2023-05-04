import { Ctx } from "blitz"
import db from "db"

export default async function getProductDetail(id, { session }: Ctx) {
  console.log(id, "id")
  const products = await db.product.findFirst({
    where: { id: id },
    select: {
      id: true,
      name: true,
      price: true,
      model: true,
    },
  })

  const productColor = await db.productColor.findMany({
    where: { productId: id },
    select: {
      id: true,
      label: true,
      imgUrl: true,
      amount: true,
    },
  })

  return { ...products, color: [...productColor] }
}
