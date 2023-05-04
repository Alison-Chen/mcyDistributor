import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const product = z.object({
  name: z.string(),
  model: z.string(),
  price: z.number(),
  color: z.array(
    z.object({
      imgUrl: z.string().array(),
      label: z.string(),
      amount: z.string(),
    })
  ),
})

export default resolver.pipe(
  resolver.zod(product),
  async ({ name, model, price, amount, color }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    try {
      const product = await db.product.create({
        data: {
          name: name,
          type: "SCOOTER",
          model: model,
          price: Number(price),
          image: color[0].imgUrl[0],
          status: true,
        },
      })

      if (product) {
        const createColor = await Promise.all(
          color.map(async (item) => {
            await db.productColor.create({
              data: {
                productId: product.id,
                value: item.label,
                label: item.label,
                imgUrl: item.imgUrl[0],
                amount: Number(item.amount),
              },
            })
          })
        )
      }

      return {
        code: "00000",
        Message: "SUCCESS",
      }
    } catch (err) {
      return {
        code: "00001",
        Message: err,
      }
    }
  }
)
