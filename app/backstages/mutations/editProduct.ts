import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z, ZodTypeAny } from "zod"

const numericString = (schema: ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === "string") {
      return parseInt(a, 10)
    } else if (typeof a === "number") {
      return a
    } else {
      return undefined
    }
  }, schema)

const product = z.object({
  id: z.number(),
  name: z.string(),
  model: z.string(),
  price: z.number(),
  color: z.array(
    z.object({
      id: z.number().optional(),
      imgUrl: z.string().array(),
      label: z.string(),
      amount: numericString(z.number()),
    })
  ),
})

export default resolver.pipe(
  resolver.zod(product),
  async ({ id, name, model, price, amount, color }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    try {
      const product = await db.product.update({
        where: {
          id,
        },
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
            if (!item.id) {
              await db.productColor.create({
                data: {
                  productId: product.id,
                  value: item.label,
                  label: item.label,
                  imgUrl: item.imgUrl[0],
                  amount: Number(item.amount),
                },
              })
            } else {
              await db.productColor.update({
                where: {
                  id: item.id,
                },
                data: {
                  productId: product.id,
                  value: item.label,
                  label: item.label,
                  imgUrl: item.imgUrl[0],
                  amount: Number(item.amount),
                },
              })
            }
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
