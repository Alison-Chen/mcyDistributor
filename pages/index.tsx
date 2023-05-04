import { useEffect } from "react"
import MainLayout from "app/core/layouts/MainLayout"
import Board from "app/dashboard/components/Board"
import isNil from "lodash/isNil"
import isNaN from "lodash/isNaN"
import { useSession } from "@blitzjs/auth"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { BlitzPage } from "@blitzjs/next"
import { store } from "data/store"
import { GetServerSideProps } from "next"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import { gSSP } from "src/blitz-server"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { useRedirectToNotReview } from "models/hooks/useRedirectToNotReview"
import { useRedirectToUserInfo } from "models/hooks/useRedirectToUserInfo"

const Home: BlitzPage = () => {
  const session = useSession()
  const router = useRouter()
  const user = useCurrentUser()
  useRedirectToNotReview(user)
  useRedirectToUserInfo(user)

  return <Board />
}
Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <MainLayout>{page}</MainLayout>

export default Home
