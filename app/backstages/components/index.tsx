import { BlitzPage } from "@blitzjs/next"
import MainLayout from "app/core/layouts/MainLayout"
import { whiteList } from "app/configs/whiteList"
import useGetCookie from "app/backstages/hooks/useGetCookie"
import { useRouter } from "next/router"

import { useFormik, FormikProvider, FormikProps, Form } from "formik"
import { Formtasy, FormtasyConfig } from "formtasy"
import { Image } from "antd"

const BackstagePage: BlitzPage = () => {
  return (
    <div className="flex justify-center items-center flex-col text-4xl font-bold my-auto">
      <p>歡迎回來， MCY MOTOR 美家園後台</p>
      <Image
        src="https://media2.giphy.com/media/QX15lZJbifeQPzcNDt/giphy.gif?cid=ecf05e47gevr271v5tktv8qo33waowqzcyk1f1qx0zbbs80d&rid=giphy.gif&ct=g"
        alt=""
        preview={false}
      />
    </div>
  )
}

export default BackstagePage
