import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import ScooterDetail from "app/scooters/components/scooterDetail"
import getCurrentUser from "app/users/queries/getCurrentUser"

const ScooterDetailPage: BlitzPage = () => {
  return <ScooterDetail />
}

ScooterDetailPage.getLayout = (page) => <MainLayout title="經銷商專區">{page}</MainLayout>

export default ScooterDetailPage
