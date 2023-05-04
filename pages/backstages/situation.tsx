import { BlitzPage } from "@blitzjs/next"
import BackstagesLayout from "app/core/layouts/BackstagesLayout"
import Situation from "app/backstages/components/situation"

const SituationPage: BlitzPage = () => {
  return <Situation />
}

SituationPage.getLayout = (page) => <BackstagesLayout title="美家園後台">{page}</BackstagesLayout>

export default SituationPage
