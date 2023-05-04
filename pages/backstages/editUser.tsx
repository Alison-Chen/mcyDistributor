import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import EditUser from "app/backstages/components/editUser"

const EditUserPage: BlitzPage = () => {
  return <EditUser />
}

EditUserPage.getLayout = (page) => <BackstagesLayout title="美家園後台">{page}</BackstagesLayout>

export default EditUserPage
