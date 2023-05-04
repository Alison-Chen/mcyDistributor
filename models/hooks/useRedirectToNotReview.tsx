import { useEffect } from "react"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"

export const useRedirectToNotReview = (user) => {
  const router = useRouter()

  useEffect(() => {
    if (!user?.review) void router.push(Routes.NotReviewPage())
  }, [router, user?.review])
}
