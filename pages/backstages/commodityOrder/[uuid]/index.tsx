import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import CommodityEditPage from "app/backstages/components/editCommodity"

const commodityOrderEditPage: BlitzPage = () => {
  return <CommodityEditPage />
}

commodityOrderEditPage.getLayout = (page) => (
  <BackstagesLayout title="物流訂單">{page}</BackstagesLayout>
)

export default commodityOrderEditPage
