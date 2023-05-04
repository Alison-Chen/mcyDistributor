import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import ScooterList from "app/scooters/components/scooterList"
import { gSSP } from "src/blitz-server"
import getCurrentUser from "app/users/queries/getCurrentUser"

const ScooterListPage: BlitzPage = () => {
  return <ScooterList />
}

ScooterListPage.getLayout = (page) => <MainLayout title="經銷商專區">{page}</MainLayout>

export default ScooterListPage
