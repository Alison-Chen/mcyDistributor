import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import { useRouterQuery, Routes, useParam } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Image, Button, notification } from "antd"

import { CheckCircleOutlined } from "@ant-design/icons"
import { scooterDetailMock, scooterModelsMock, scooterColorsMock } from "app/configs/constant"
import { refineAssemble, refineBattery } from "app/configs/refine"
import { useSession } from "@blitzjs/auth"
import getProduct from "app/scooters/queries/getProduct"
import getProducts from "app/scooters/queries/getProducts"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import { useRedirectToNotReview } from "models/hooks/useRedirectToNotReview"
import { useRedirectToUserInfo } from "models/hooks/useRedirectToUserInfo"

import { useFormik, FormikProvider, FormikProps, Formik, Form } from "formik"
import { Formtasy, FormtasyConfig } from "formtasy"
import { whiteList } from "app/configs/whiteList"
import { schema } from "app/scooters/components/config"

import numberToCurrency from "app/utils/numberToCurrency"
import redux from "data/redux"

const ScooterDetail = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [shopList, setShopList] = useState([])
  const [image, setImage] = useState("")
  const [max, setMax] = useState(0)
  const [id, setId] = useState()
  const [color, setColor] = useState()
  const [amount, setAmount] = useState(1)

  const user = useCurrentUser()

  const router = useRouter()

  useRedirectToNotReview(user)
  useRedirectToUserInfo(user)

  const { id: queryId } = router.query

  const [product] = useQuery(getProduct, { id: Number(queryId) })
  const [products] = useQuery(getProducts, { status: true, type: "SCOOTER" })

  const [api, contextHolder] = notification.useNotification()

  const session = useSession()

  useEffect(() => {
    setId(Number(queryId))

    if (localStorage.getItem("cart")) {
      setShopList(JSON.parse(localStorage.getItem("cart")))
    }
  }, [])

  useEffect(() => {
    setImage(product?.colorInfo?.[0]?.imgUrl)
    setColor(product?.colorInfo?.[0]?.value)
    setMax(product?.colorInfo?.[0]?.amount)
  }, [id, product?.colorInfo])

  const batteryConfig = [
    { id: 1, desc: "有量16AH 鋰電池" },
    { id: 2, desc: "鉛酸24AH電池(需另附)" },
    { id: 3, desc: "不需電池" },
  ]

  const assembleConfig = [
    { id: 1, desc: "電池寄車" },
    { id: 2, desc: "電池裝上" },
    { id: 3, desc: "隨車另附" },
  ]

  const chargerConfig = [
    { id: 1, value: true, label: "需要充電器" },
    { id: 2, value: false, label: "不要充電器" },
  ]

  const initialValues = {
    model: id,
    color: color,
    amount: 1,
    battery: 1,
    assemble: 1,
    charger: true,
  }

  const formtasyConfig = { whiteList }

  const handleOnSubmit = async (values, { resetForm }) => {
    setIsLoading(true)
    try {
      const value = {
        ...values,
        assemble: refineAssemble[values?.assemble],
        battery: refineBattery[values?.battery],
        userId: session.userId,
        price: product?.price,
        imgUrl: image,
        amount: amount,
      }

      setShopList((prev) => [...prev, value])

      redux.setSchema([...shopList, value])

      localStorage.setItem("cart", JSON.stringify([...shopList, value]))

      setIsLoading(false)
      resetForm()

      api.open({
        message: "加入購物車成功",
        description: "下單前請確認購物車數量、顏色是否正確",
        duration: 0,
      })
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  const formBlock = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: handleOnSubmit,
  })

  const handleOnChange = (e) => {
    const arr = product?.colorInfo.filter((color) => e.target.value === color.value)
    setColor(e.target.value)
    setImage(arr[0]?.imgUrl)
    setMax(arr[0]?.amount)
    setAmount(1)
  }

  const handleChangeModel = (e) => {
    setId(e.target.value)
    void router.push(Routes.ScooterDetailPage({ id: e.target.value }))
  }

  const fsInject = {
    model: {
      properties: {
        options: products.map((item) => ({ label: item?.name, value: item?.id })),
        onChange: handleChangeModel,
      },
    },
    productImage: {
      properties: {
        name: product?.name,
        price: numberToCurrency(product?.price),
        image,
      },
    },
    color: {
      properties: {
        options: product?.colorInfo?.map((color) => ({ label: color?.label, value: color?.value })),
        onChange: handleOnChange,
        value: color,
      },
    },
    amount: {
      properties: {
        max: max,
        onChange: (num: number) => {
          setAmount(num)
        },
        value: amount,
      },
    },
    battery: {
      properties: {
        options: batteryConfig?.map((battery) => ({ label: battery?.desc, value: battery?.id })),
      },
    },
    charger: {
      properties: {
        options: chargerConfig?.map((charger) => ({
          label: charger?.label,
          value: charger?.value,
        })),
      },
    },
    submit: {
      properties: {
        loading: isLoading,
      },
    },
  }

  return (
    initialValues && (
      <div className="my-10 flex flex-col justify-center items-center p-10 max-w-[948px] mx-auto">
        <div className="text-center mb-4">
          <p className="text-2xl">依車型選擇配件</p>
          <p>選擇您的車款，尋找適合的配件</p>
        </div>
        <FormikProvider value={formBlock}>
          <FormtasyConfig value={formtasyConfig}>
            <Form className="flex flex-col space-x-0 p-10 lg:space-x-10 lg:p-0 lg:flex-row justify-center items-center lg:items-start">
              <Formtasy schema={schema} fsInject={fsInject} />
            </Form>
          </FormtasyConfig>
        </FormikProvider>
        {contextHolder}
      </div>
    )
  )
}

export default ScooterDetail
