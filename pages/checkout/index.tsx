import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import Checkout from "app/checkout/components/checkout"

const CheckoutPage: BlitzPage = () => {
  return <Checkout />
}

CheckoutPage.getLayout = (page) => <MainLayout title="經銷商專區">{page}</MainLayout>

export default CheckoutPage
