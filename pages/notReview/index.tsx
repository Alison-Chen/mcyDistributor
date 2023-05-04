import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import NotReview from "app/notReview/components"

const NotReviewPage: BlitzPage = () => {
  return <NotReview />
}

NotReviewPage.getLayout = (page) => <MainLayout title="經銷商專區">{page}</MainLayout>

export default NotReviewPage
