import { Ctx } from "blitz"
import db from "db"

export default async function getUserSell(data, { session }: Ctx) {
  const users = await db.User.findMany({
    select: {
      id: true,
      companyName: true,
    },
  })

  const commodityOrder = await db.commodityOrder.findMany({
    where: {
      status: {
        not: "CANCEL",
      },
    },
    select: {
      shoplist: true,
      price: true,
      userId: true,
    },
  })

  const userShoplists = users.map((user) => {
    const orders = commodityOrder.map((order) => {
      if (order.userId == user.id) return order
    })
    return orders
  })

  let items = []
  for (var i = 0; i < userShoplists.flat(1)?.length; i++) {
    items = items?.concat(
      JSON.parse(userShoplists.flat(1)[i]?.shoplist)?.map((elem) => {
        return {
          id: elem?.model,
          amount: elem?.amount,
          name: elem?.name,
          color: elem?.color,
          price: elem?.amount * elem?.price,
          userId: userShoplists.flat(1)[i]?.userId,
        }
      })
    )
  }

  let result = []
  items.forEach(function (a) {
    if (!this[a.color] && !this[a.userId]) {
      this[a.color] = {
        id: a.id,
        name: a.name,
        price: 0,
        amount: 0,
        color: a.color,
        userId: a.userId,
      }
      result.push(this[a.color])
    }
    this[a.color].price += a.price
    this[a.color].amount += a.amount
  }, {})

  const final = users.map((user) => {
    const data = result.map((item) => {
      if (user.id === item.userId) return { ...item, companyName: user.companyName }
    })
    return data
  })

  return final[0]

  // const products = await db.product.findMany({
  //   where: {
  //     type: {
  //       not: "COMPONENT",
  //     },
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //   },
  // })

  // const productsColor = await db.productColor.findMany({
  //   select: {
  //     productId: true,
  //     value: true,
  //     label: true,
  //     imgUrl: true,
  //   },
  // })

  // const refineProducts = products.map((item) => {
  //   const colors = productsColor.filter((color) => color.productId === item.id)
  //   return {
  //     ...item,
  //     color: colors,
  //   }
  // })

  // const flatPrd = refineProducts.map((item) => {
  //   const perColor = item.color.map((color) => {
  //     return {
  //       ...item,
  //       color: color.label,
  //       imgUrl: color.imgUrl,
  //     }
  //   })
  //   return perColor
  // })

  // let items = []
  // for (var i = 0; i < commodityOrder?.length; i++) {
  //   items = items?.concat(
  //     JSON.parse(commodityOrder[i]?.shoplist)?.map((elem) => {
  //       return {
  //         id: elem?.model,
  //         amount: elem?.amount,
  //         name: elem?.name,
  //         color: elem?.color,
  //         price: elem?.amount * elem?.price,
  //         userId: commodityOrder[i]?.userId,
  //       }
  //     })
  //   )
  // }

  // let result = []
  // items.forEach(function (a) {
  //   if (!this[a.color] && !this[a.userId]) {
  //     this[a.color] = {
  //       id: a.id,
  //       name: a.name,
  //       price: 0,
  //       amount: 0,
  //       color: a.color,
  //       userId: a.userId,
  //     }
  //     result.push(this[a.color])
  //   }
  //   this[a.color].price += a.price
  //   this[a.color].amount += a.amount
  // }, {})

  // const final = users.map((res) => {
  //   const colors = result.map((item) => ({ ...res, ...item }))

  //   console.log(colors, "colors")

  //   return colors
  // })
  // // const pageNameSet = Array.from(new Set([...final.flat(1).map((item) => item.id)]))

  // return final
}
