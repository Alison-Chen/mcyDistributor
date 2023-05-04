import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import Product from "app/backstages/components/product"

const ProductPage: BlitzPage = () => {
  return <Product />
}

ProductPage.getLayout = (page) => <BackstagesLayout title="美家園後台">{page}</BackstagesLayout>

export default ProductPage
