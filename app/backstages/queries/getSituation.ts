import { Ctx } from "blitz"
import db from "db"

export default async function getSituation(data, { session }: Ctx) {
  const commodityOrder = await db.commodityOrder.findMany({
    where: {
      status: {
        not: "CANCEL",
      },
    },
    select: {
      shoplist: true,
      price: true,
    },
  })

  const products = await db.product.findMany({
    where: {
      type: {
        not: "COMPONENT",
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  const productsColor = await db.productColor.findMany({
    select: {
      productId: true,
      value: true,
      label: true,
      imgUrl: true,
    },
  })

  const refineProducts = products.map((item) => {
    const colors = productsColor.filter((color) => color.productId === item.id)
    return {
      ...item,
      color: colors,
    }
  })

  const flatPrd = refineProducts.map((item) => {
    const perColor = item.color.map((color) => {
      return {
        ...item,
        color: color.label,
        imgUrl: color.imgUrl,
      }
    })
    return perColor
  })

  let items = []
  for (var i = 0; i < commodityOrder?.length; i++) {
    items = items?.concat(
      JSON.parse(commodityOrder[i]?.shoplist)?.map((elem) => {
        return {
          id: elem?.model,
          amount: elem?.amount,
          name: elem?.name,
          color: elem?.color,
          price: elem?.amount * elem?.price,
        }
      })
    )
  }

  let result = []
  items.forEach(function (a) {
    if (!this[a.color]) {
      this[a.color] = { id: a.id, name: a.name, price: 0, amount: 0, color: a.color }
      result.push(this[a.color])
    }
    this[a.color].price += a.price
    this[a.color].amount += a.amount
  }, {})

  const final = flatPrd.flat(1).map((res) => {
    const colors = result.filter((item) => {
      if (res.id === item.id && res.color === item.color) return { ...res, ...item }
    })

    return { ...res, ...colors[0] }
  })
  // const pageNameSet = Array.from(new Set([...final.flat(1).map((item) => item.id)]))
  // console.log(final, "mappingList")

  return final
}
