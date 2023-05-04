import react, { useState, useEffect } from "react"
import { Table, Button, Image, notification } from "antd"
import NumberInput from "models/components/NumberInput"
import redux from "data/redux"
import { Routes } from "@blitzjs/next"
import { scooterListMock } from "app/configs/constant"

import { useRouter } from "next/router"
import { useRedirectToNotReview } from "models/hooks/useRedirectToNotReview"
import { useRedirectToUserInfo } from "models/hooks/useRedirectToUserInfo"

import getRandom from "app/utils/getRandom"
import numberToCurrency from "app/utils/numberToCurrency"

const Shoplist = ({ current, setCurrent, products, shoplist, setShoplist, user }) => {
  const [value, setValue] = useState(0)
  const router = useRouter()

  const [api, contextHolder] = notification.useNotification()

  useRedirectToNotReview(user)
  useRedirectToUserInfo(user)

  useEffect(() => {
    const config = products?.reduce((a, v) => ({ ...a, [v.id]: v.name }), {})
    const refineShoplist = JSON.parse(localStorage.getItem("cart"))?.map((item) => {
      item.name = config?.[item.model]
      return item
    })

    setShoplist(refineShoplist)
    redux.setSchema(JSON.parse(localStorage.getItem("cart")))
  }, [products, setShoplist])

  const handleOnDelete = (index) => {
    const newList = Object.assign(shoplist)
    const removed = newList.splice(index, 1)
    localStorage.setItem("cart", JSON.stringify([...newList]))
    redux.deleteSchema(index)
    setShoplist([...newList])
  }

  const handleOnClick = () => {
    if (!shoplist || shoplist?.length < 1) {
      api.open({
        message: "購物車內無商品！",
        description: "下單前請確認購物車數量、顏色是否正確",
        duration: 0,
      })
      return
    }
    current < 1 ? setCurrent(current + 1) : setCurrent(current - 1)
  }

  const handleOnChange = (values, index) => {
    const newList = Object.assign(shoplist)
    newList[index].amount = values
    localStorage.setItem("cart", JSON.stringify([...newList]))
    setShoplist([...newList])
  }

  const handleOnNavigate = (id) => {
    void router.push(Routes.ScooterDetailPage({ id }))
  }

  const columns = [
    {
      title: "商品資訊",
      dataIndex: "info",
      key: "info",
      render: (_, rowData) => (
        <div>
          <p>{rowData?.name}</p>
          <p>顏色 : {rowData?.color}</p>
        </div>
      ),
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
      title: "數量",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (_, data, index) => {
        return (
          <NumberInput value={data?.amount} min={1} onChange={(e) => handleOnChange(e, index)} />
        )
      },
    },
    {
      title: "單價",
      dataIndex: "perPrice",
      key: "perPrice",
      render: (_, rowData) => <div>$ {numberToCurrency(rowData?.price)}</div>,
    },
    {
      title: "小計",
      dataIndex: "total",
      key: "total",
      width: 300,
      render: (_, rowData) => <div>$ {numberToCurrency(rowData?.price * rowData?.amount)}</div>,
    },
    {
      key: "action",
      render: (_, rowData, index) => (
        <Button danger onClick={() => handleOnDelete(index)}>
          刪除
        </Button>
      ),
    },
  ]
  return (
    <>
      <div className="lg:flex justify-center items-start lg:m-10">
        <div className="lg:w-2/3 mx-10">
          <p className="text-xl">
            購物車 {`( ${shoplist?.length ? shoplist?.length : 0} 樣商品 )`}{" "}
          </p>
          <div className="my-8">
            <p className="text-lg">訂車款</p>
            <Table
              columns={columns}
              dataSource={shoplist}
              pagination={false}
              scroll={{ x: 1000, y: 300 }}
            />
          </div>
          {/* <div>
            <p className="text-lg">訂零件</p>
            <Table columns={columns} dataSource={shoplist} pagination={false} />
            {console.log(shoplist, "shooooplist")}
          </div> */}
        </div>
        <div className="summary mx-10 lg:mx-0 lg:w-1/4 lg:sticky top-20 lg:right-0 bg-gray-50 p-5 lg:mt-[6.5rem]">
          <div className="text-xl font-bold flex justify-between items-center mt-4">
            <p>總金額</p>
            <p>
              TWD ${" "}
              {numberToCurrency(shoplist?.reduce((acc, item) => acc + item.amount * item.price, 0))}
            </p>
          </div>
          <Button type="primary" className="w-full" onClick={handleOnClick}>
            下一步
          </Button>
        </div>
      </div>
      <div className="m-10">
        <p className="mx-10 text-2xl font-semibold text-center lg:text-left">您可能會感興趣</p>
        <div className="flex flex-col lg:flex-row items-center justify-center">
          {getRandom(scooterListMock, 4).map((item) => (
            <div
              className="cursor-pointer w-2/3 md:w-1/3 lg:max-w-[30%] m-4 flex flex-col items-center pointer"
              key={item.id}
              onClick={() => handleOnNavigate(item.id)}
            >
              <Image alt={item?.name} src={item?.image} preview={false} width="50%" />
              <div className="text-center text-xl">
                <p>{item?.name}</p>
                <p>{`NT$ ${numberToCurrency(item?.price)}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {contextHolder}
    </>
  )
}

export default Shoplist
