import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import EditProduct from "app/backstages/components/editProduct"

const EditProductPage: BlitzPage = () => {
  return <EditProduct />
}

EditProductPage.getLayout = (page) => <BackstagesLayout title="美家園後台">{page}</BackstagesLayout>

export default EditProductPage
