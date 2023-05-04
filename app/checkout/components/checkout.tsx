import react, { useState, useEffect } from "react"
import { Steps, Button, Card, Table, Image } from "antd"
import redux from "data/redux"
import { useRouter } from "next/router"
import { Routes } from "@blitzjs/next"
import FirstStepForm from "./firstStepForm"
import FinalStep from "./finalStep"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import Shoplist from "app/shopList/components/shoplist"
import getProducts from "app/scooters/queries/getProducts"
import { useQuery, useMutation } from "@blitzjs/rpc"
import CreateOrder from "app/checkout/mutations/createOrder"
import numberToCurrency from "app/utils/numberToCurrency"
import { useRedirectToNotReview } from "models/hooks/useRedirectToNotReview"
import { useRedirectToUserInfo } from "models/hooks/useRedirectToUserInfo"

const Checkout = () => {
  const [shoplist, setShoplist] = useState([])
  const [current, setCurrent] = useState(0)

  const user = useCurrentUser()
  useRedirectToNotReview(user)
  useRedirectToUserInfo(user)
  const [products] = useQuery(getProducts, { status: true })

  const [createOrderMutation] = useMutation(CreateOrder)

  const router = useRouter()

  useEffect(() => {
    const config = products?.reduce((a, v) => ({ ...a, [v.id]: v.name }), {})
    const refineShoplist = JSON.parse(localStorage.getItem("cart"))?.map((item) => {
      item.name = config?.[item.model]
      return item
    })

    setShoplist(refineShoplist)
  }, [products])

  const handleOnSubmit = async (values) => {
    const { city, county, address, email, name, taxId, cellphone, mark } = values
    const uid = Date.now().toString()
    const refineValues = {
      email,
      taxId,
      name,
      mark,
      shoplist: JSON.stringify(shoplist),
      address: `${city}${county}${address}`,
      userId: user?.id,
      phone: cellphone,
      price: shoplist?.reduce((acc, item) => acc + item.amount * item.price, 0),
    }
    const res = await createOrderMutation(refineValues)
    if (res) {
      localStorage.setItem("cart", JSON.stringify([]))
      redux.deleteAllSchema()
      void router.push(`/checkout/final?id=${res?.uuid}`)
    }
  }

  const steps = [
    {
      title: "確認商品明細",
      content: (
        <Shoplist
          current={current}
          setCurrent={setCurrent}
          products={products}
          shoplist={shoplist}
          setShoplist={setShoplist}
          user={user}
        />
      ),
    },
    {
      title: "填寫運送資料",
      content: (
        <FirstStepForm
          current={current}
          setCurrent={setCurrent}
          shoplist={shoplist}
          setShoplist={setShoplist}
          user={user}
          handleOnSubmit={handleOnSubmit}
        />
      ),
    },
  ]

  const columns = [
    {
      title: "商品名稱",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "商品圖片",
      dataIndex: "imgUrl",
      key: "imgUrl",
      width: 150,
      render: (_, data) => (
        <Image alt={data.name} src={data?.imgUrl} preview={false} width="100%" />
      ),
    },
    {
      title: "顏色",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "數量",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "金額",
      dataIndex: "price",
      key: "price",
      render: (_, rowData) => <div>$ {numberToCurrency(rowData?.price)}</div>,
    },
  ]

  const items = steps.map((item) => ({ key: item.title, title: item.title }))
  return (
    <div className="w-[99vw] mx-4 lg:p-10 md:mx-auto lg:mx-[10px] xl:mx-auto xl:w-[1440px]">
      <div className="max-w-lg lg:mx-auto mx-10 my-4">
        <Steps current={current} items={items} />
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-between items-start md:mt-10">
        <div className="steps-content w-full mr-10">{steps[current].content}</div>
        {current == 1 && (
          <div className="summary lg:w-2/3 lg:sticky top-20 right-0 bg-gray-50 p-5">
            <p>訂單摘要</p>
            <Table columns={columns} dataSource={shoplist} pagination={false} />
            <div className="text-lg font-semibold flex justify-between items-center mt-4 px-4">
              <p>總金額</p>
              <p>
                TWD ${" "}
                {numberToCurrency(
                  shoplist?.reduce((acc, item) => acc + item.amount * item.price, 0)
                )}
              </p>
            </div>
            <p>下單前請再次確認您的購買明細及配送資訊，訂單成立後無法異動訂單內容！</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
