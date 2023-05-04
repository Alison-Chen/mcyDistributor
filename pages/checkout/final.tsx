import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import FinalPage from "app/checkout/components/finalPage"

const CheckoutFinalPage: BlitzPage = () => {
  return <FinalPage />
}

CheckoutFinalPage.getLayout = (page) => <MainLayout title="經銷商專區">{page}</MainLayout>

export default CheckoutFinalPage
