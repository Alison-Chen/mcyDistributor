import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import { Formtasy, FormtasyConfig } from "formtasy"
import { useFormik, FormikProvider, FormikProps, Form } from "formik"
import { whiteList } from "app/configs/whiteList"
import * as yup from "yup"
import getCookie from "app/utils/getCookie"
import setCookie from "app/utils/setCookie"
import { useRouter } from "next/router"

import { Card, message } from "antd"

import { getAuth, signInWithEmailAndPassword, setPersistence } from "firebase/auth"
import useGetCookie from "app/backstages/hooks/useGetCookie"

const BackstageLogin: BlitzPage = () => {
  const router = useRouter()

  const cookie = useGetCookie()

  const formtasyConfig = { whiteList }

  const auth = getAuth()

  const schema = [
    {
      type: "Input",
      properties: {
        label: "帳號",
        name: "email",
        id: "email",
        placeholder: "請輸入後台帳號",
      },
    },
    {
      type: "Input",
      properties: {
        label: "密碼",
        name: "password",
        id: "password",
        type: "password",
        placeholder: "請輸入後台密碼",
      },
    },
    {
      type: "Button",
      properties: {
        text: "送出",
        htmlType: "submit",
        className: "w-full",
      },
    },
  ]

  const validationSchema = yup.object().shape({
    email: yup.string().email("請輸入正確電子郵件格式").required("請輸入電子郵件"),
    password: yup.string().required("請輸入密碼"),
  })

  const handleOnSubmit = async (values) => {
    const { email, password } = values
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      setCookie("backstageToken", token, 30)
      void router.push("/backstages")
    } catch (err) {
      console.log(err?.message, "err")
      if (err?.message === "Firebase: Error (auth/wrong-password).")
        return message.error("密碼錯誤")
    }
  }

  const formBlock = useFormik({
    enableReinitialize: true,
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleOnSubmit,
  })

  return (
    <div className="flex min-h-[100vh] justify-center items-center bg-gray-100">
      <div className="container m-auto w-[380px]">
        <Card title="MCY 美家園後台管理系統" className="text-center">
          <FormikProvider value={formBlock}>
            <FormtasyConfig value={formtasyConfig}>
              <Form className="text-start">
                <Formtasy schema={schema} />
              </Form>
            </FormtasyConfig>
          </FormikProvider>
        </Card>
      </div>
    </div>
  )
}

export default BackstageLogin
