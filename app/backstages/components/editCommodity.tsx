import { BlitzPage } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import { useRouterQuery, Routes, useParam } from "@blitzjs/next"
import getCommodityOrder from "app/backstages/queries/getCommodity"
import updateCommodityOrder from "app/backstages/mutations/updateCommodityOrder"
import cancelCommodityOrder from "app/backstages/mutations/cancelCommodityOrder"
import { useRouter } from "next/router"

import moment from "moment"
import numberToCurrency from "app/utils/numberToCurrency"

import { useFormik, FormikProvider, FormikProps, Formik, Form } from "formik"
import { Formtasy, FormtasyConfig } from "formtasy"
import { whiteList } from "app/configs/whiteList"
import * as yup from "yup"

import { Table, Button, Modal, message, Input, Tabs } from "antd"
import { AiOutlineArrowLeft } from "react-icons/ai"

const CommodityEditPage: BlitzPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const formtasyConfig = { whiteList }

  const router = useRouter()
  const [commodityOrder] = useQuery(getCommodityOrder, router.query.uuid)
  const [updateCommodityOrderMutation] = useMutation(updateCommodityOrder)
  const [modal, contextHolder] = Modal.useModal()

  const urlParams = new URL(window.location.href).searchParams
  const status = urlParams.get("status")

  const handleOnSubmit = async (values) => {
    setIsLoading(true)
    const res = await invoke(updateCommodityOrderMutation, { ...values })
    if (res) {
      setTimeout(() => {
        setIsLoading(false)
        void router.push("/backstages/commodityOrder")
      }, 1000)
    }
  }

  const schema = [
    {
      type: "Input",
      properties: {
        label: "訂單編號",
        name: "uuid",
        id: "uuid",
        placeholder: "請輸入訂單編號",
        disabled: true,
      },
    },
    {
      type: "Input",
      properties: {
        name: "name",
        id: "name",
        placeholder: "請輸入顧客名稱",
        label: "顧客名稱",
      },
    },
    {
      type: "Input",
      properties: {
        name: "taxId",
        id: "taxId",
        placeholder: "請輸入統編",
        label: "統編",
        maxLength: 8,
      },
    },
    {
      type: "Input",
      properties: {
        name: "phone",
        id: "phone",
        placeholder: "請輸入手機號碼",
        label: "手機號碼",
        maxLength: 10,
      },
    },
    {
      type: "Input",
      properties: {
        name: "email",
        id: "email",
        placeholder: "請輸入電子信箱",
        label: "電子信箱",
      },
    },
    {
      type: "Input",
      properties: {
        name: "address",
        id: "address",
        placeholder: "請輸入地址",
        label: "地址",
      },
    },
    {
      type: "Input",
      properties: {
        name: "logisticOrderId",
        id: "logisticOrderId",
        label: "物流訂單編號",
        disabled: status === "DELIVER" ? false : true,
      },
    },
    {
      type: "Button",
      properties: {
        text: "送出",
        htmlType: "submit",
        type: "primary",
        loading: isLoading,
      },
    },
  ]

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("請輸入姓名")
      .test("name", "請輸入半形中 / 英文", (value) => value?.match(/^[\u4e00-\u9fa5a-zA-Z]+$/)),
    email: yup
      .string()
      .nullable("請輸入電子信箱")
      .required("請輸入電子信箱")
      .test("phone", "請輸入正確電子信箱格式", (value) => {
        if (value?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return true
        return false
      }),
    taxId: yup
      .string()
      .required("請輸入統一編號")
      .test("taxId", "請輸入正確統一編號格式", (value) => value?.match(/^[0-9]{8}$/)),
    address: yup
      .string()
      .required("請輸入地址")
      .test("companyName", "請輸入中文/半型英文數字", (value) => {
        {
          if (value?.match(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/)) return true
          return false
        }
      }),
    phone: yup
      .string()
      .required("請輸入手機號碼")
      .test("cellphone", "請輸入正確手機格式", (value) => {
        if (value?.match(/09\d{8}/)) return true
        return false
      }),
    logisticOrderId: yup
      .string()
      .nullable(true)
      .test("logisticOrderId", "請輸入物流訂單編號", (value) => {
        if (status === "DELIVER" && !value) return false
        return true
      }),
  })

  const formBlock = useFormik({
    enableReinitialize: true,
    initialValues: commodityOrder,
    validationSchema,
    onSubmit: handleOnSubmit,
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-start text-2xl mb-4">
        <AiOutlineArrowLeft
          className="cursor-pointer hover:text-blue-500 duration-300"
          onClick={() => router.push("/backstages/commodityOrder")}
        />
        <p className="my-0 mx-4">編輯商品訂單</p>
      </div>
      <FormikProvider value={formBlock}>
        <FormtasyConfig value={formtasyConfig}>
          <Form>
            <Formtasy schema={schema} />
          </Form>
        </FormtasyConfig>
      </FormikProvider>
      {contextHolder}
    </div>
  )
}

export default CommodityEditPage
