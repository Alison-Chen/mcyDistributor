import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import UserInfo from "app/users/components"

const UserInfoPage: BlitzPage = () => {
  return <UserInfo />
}

UserInfoPage.getLayout = (page) => <MainLayout title="經銷商專區">{page}</MainLayout>

export default UserInfoPage
