import React, { useState, useEffect } from "react"
import moment from "moment"
import { Card, Table, Image } from "antd"
import { useQuery } from "@blitzjs/rpc"
import getOrderList from "app/checkout/queries/getOrderList"

const FinalPage = () => {
  const urlParams = new URL(window.location.href).searchParams
  const uuid = urlParams.get("id")

  const [orderlist] = useQuery(getOrderList, { uuid })

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
      wdith: 50,
    },
    {
      title: "數量",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "單價",
      dataIndex: "perPrice",
      key: "perPrice",
      width: "250px",
      render: (_, rowData) => <div>$ {rowData?.price}</div>,
    },
  ]
  return (
    <div className="mx-4 lg:p-10 md:mx-auto lg:mx-[10px] xl:mx-auto xl:w-[1440px]">
      <Card title={<div className="text-center">感謝您的訂購</div>}>
        <div>
          <p>訂單編號: {uuid}</p>
          <p>訂購日期: {moment(orderlist?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p>
          <Table columns={columns} dataSource={orderlist?.shoplist} pagination={false} />
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mt-4">
            <div>
              <p>
                收件人: {orderlist?.name} / {orderlist?.phone}
              </p>
              <p>配送地址: {orderlist?.address}</p>
            </div>
            <p className="w-full text-xl font-bold lg:w-1/4 lg:pl-5 max-w-[250px]">
              應付金額:
              <div>TWD $ {orderlist.price}</div>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FinalPage
