import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import Backstage from "app/backstages/components"

const BackstagePage: BlitzPage = () => {
  return <Backstage />
}

BackstagePage.getLayout = (page) => <BackstagesLayout title="美家園後台">{page}</BackstagesLayout>

export default BackstagePage
