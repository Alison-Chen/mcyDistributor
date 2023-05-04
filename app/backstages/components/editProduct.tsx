import { BlitzPage } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import { Routes, useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import moment from "moment"
import numberToCurrency from "app/utils/numberToCurrency"

import { useFormik, FormikProvider, FormikProps, Formik, Form } from "formik"
import { Formtasy, FormtasyConfig } from "formtasy"
import { whiteList } from "app/configs/whiteList"
import * as yup from "yup"

import { Table, Button, Modal, message, Input, Tabs } from "antd"
import { AiOutlineArrowLeft } from "react-icons/ai"

import addProduct from "app/backstages/mutations/addProduct"
import editProduct from "app/backstages/mutations/editProduct"
import getProductDetail from "app/backstages/queries/getProductDetail"

const EditProduct: BlitzPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    name: "",
    model: "",
    price: "",
    color: [],
  })
  const formtasyConfig = { whiteList }

  const router = useRouter()
  const [addProductMutation] = useMutation(addProduct)
  const [editProductMutation] = useMutation(editProduct)
  const [modal, contextHolder] = Modal.useModal()

  const searchParams = new URL(window.location.href).searchParams
  const id = searchParams.get("id")

  useEffect(() => {
    const getProduct = async () => {
      const res = await invoke(getProductDetail, Number(id))
      const refineColors = res?.color?.map((item) => ({ ...item, imgUrl: [item.imgUrl] }))
      setInitialValues({ ...res, color: [...refineColors] })
    }
    if (id) void getProduct()
  }, [id])

  const handleOnSubmit = async (values) => {
    setIsLoading(true)
    const res = id
      ? await invoke(editProductMutation, {
          ...values,
          price: Number(values.price),
        })
      : await invoke(addProductMutation, {
          ...values,
          price: Number(values.price),
        })

    if (res?.code === "00000") {
      setTimeout(() => {
        setIsLoading(false)
        void router.push("/backstages/products")
      }, 1000)
    }
  }

  const schema = [
    {
      type: "Input",
      properties: {
        label: "商品名稱",
        name: "name",
        id: "name",
        placeholder: "請輸入商品名稱",
      },
    },
    {
      type: "Input",
      properties: {
        name: "model",
        id: "model",
        placeholder: "請輸入商品型號",
        label: "商品型號",
      },
    },
    {
      type: "Input",
      properties: {
        name: "price",
        id: "price",
        placeholder: "請輸入商品價錢",
        label: "商品價錢",
      },
    },
    {
      type: "Repeater",
      properties: {
        name: "color",
        id: "color",
        label: "請輸入商品顏色",
        defaultValue: "",
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
    name: yup.string().required("請輸入商品名稱"),
    // .test("name", "請輸入半形中 / 英文", (value) => value?.match(/^[\u4e00-\u9fa5a-zA-Z]+$/)),
    model: yup.string().required("請輸入商品名稱"),
    // .test("name", "請輸入半形中 / 英文", (value) => value?.match(/^[\u4e00-\u9fa5a-zA-Z]+$/)),
    price: yup
      .number("請輸入商品價錢")
      .required("請輸入商品價錢")
      .typeError("不可輸入特殊符號，請輸入正整數")
      .test("price", "請輸入正整數", (value) => {
        if (value > 0) return true
        return false
      }),
    color: yup
      .mixed()
      .test("color", "請新增至少一個商品顏色", (values) => {
        if (values?.length === 0) return false
        return true
      })
      .test("color", "請填寫全部欄位 ( 圖片、顏色名稱、色號 )", (values) => {
        const isPass = values.every((item) => {
          if (item?.url?.length === 0) return false
          if (item?.label === "" || !item?.label) return false
          if (item?.amount <= 0 || !item?.amount) return false

          return true
        })
        return isPass
      }),
  })

  const formBlock = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: handleOnSubmit,
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-start text-2xl mb-4">
        <AiOutlineArrowLeft
          className="cursor-pointer hover:text-blue-500 duration-300"
          onClick={() => router.push("/backstages/products")}
        />
        <p className="my-0 mx-4">編輯商品</p>
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

export default EditProduct
