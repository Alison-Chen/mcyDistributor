import { useEffect } from "react"
import { useRouter } from "next/router"
import getCookie from "app/utils/getCookie"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { initializeApp } from "firebase/app"
import useInitialize from "app/backstages/hooks/useInitialize"

const useGetCookie = () => {
  const router = useRouter()

  const { firebase } = useInitialize()

  useEffect(() => {
    const isToken = async () => {
      const auth = getAuth()
      const csrfToken = getCookie("backstageToken")
      onAuthStateChanged(auth, (user) => {
        if (csrfToken == user?.accessToken) {
          void router.push("/backstages")
        } else {
          void router.push("/backstages/login")
        }
      })
    }
    void isToken()
  }, [])

  return { firebase }
}

export default useGetCookie
