import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import UserSell from "app/backstages/components/userSell"

const UserSellPage: BlitzPage = () => {
  return <UserSell />
}

UserSellPage.getLayout = (page) => <BackstagesLayout title="美家園後台">{page}</BackstagesLayout>

export default UserSellPage
