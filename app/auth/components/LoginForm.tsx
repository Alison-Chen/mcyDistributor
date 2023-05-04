import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { Button } from "antd"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import signup from "app/auth/mutations/signup"
import { signIn, signOut, useSession } from "next-auth/react"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [payload, setPayload] = useState(null)
  const [idToken, setIdToken] = useState(null)

  const { data: session, status } = useSession()

  // const [loginMutation] = useMutation(login)
  const [signupMutation] = useMutation(signup)

  const clientId = "1657800743"
  const redirectUri = "http://localhost:3000/api/auth/callback/line"
  const secret = "332bc105c2846dc44b72761dce01165d"

  const generateRandomString = (num) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const result = Math.random().toString(36).substring(0, num)

    return result
  }

  const router = useRouter()

  const handleOnLogin = async () => {
    void router.push(
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=login&scope=openid%20profile`
    )
  }

  useEffect(() => {
    const signUp = async () => {
      const user = await signupMutation({
        name: session?.user?.name,
        lineId: session?.id,
      })
      void router.push(Routes.Home())
    }

    if (session) {
      void signUp()
    }
  }, [router, session, signupMutation])

  return (
    <div>
      <h1>Login</h1>
      <Button onClick={() => signIn("line")}>Line 登入</Button>
      {/* {payload && idToken ? console.log("payload", payload, "idToken", idToken) : <></>}
      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <div>
          <Link href={Routes.ForgotPasswordPage()}>
            <a>Forgot your password?</a>
          </Link>
        </div>
      </Form>

      <div style={{ marginTop: "1rem" }}>
        Or{" "}
        <Link href={Routes.SignupPage()}>
          <a>Sign Up</a>
        </Link>
      </div> */}
    </div>
  )
}

export default LoginForm
