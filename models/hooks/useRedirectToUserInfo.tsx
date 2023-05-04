import { useEffect } from "react"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"

export const useRedirectToUserInfo = (user) => {
  const router = useRouter()

  useEffect(() => {
    if (!user?.address || !user?.companyName || !user?.phone || !user?.taxId)
      void router.push(Routes.UserInfoPage())
  }, [router, user?.address, user?.companyName, user?.phone, user?.taxId])
}
