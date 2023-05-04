import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import CommodityPage from "app/backstages/components/commodity"

const commodityOrderPage: BlitzPage = () => {
  return <CommodityPage />
}

commodityOrderPage.getLayout = (page) => (
  <BackstagesLayout title="物流訂單">{page}</BackstagesLayout>
)

export default commodityOrderPage
