import React, { useEffect } from "react"
import { Table, Button, Space, Tag, Modal, Card, Image } from "antd"
import { useQuery, invoke } from "@blitzjs/rpc"
import getOrderLists from "app/checkout/queries/getOrderLists"
import getOrderList from "app/checkout/queries/getOrderList"
import getProducts from "app/scooters/queries/getProducts"
import moment from "moment"

import numberToCurrency from "app/utils/numberToCurrency"

const Order = ({ id }) => {
  const [orderlists] = useQuery(getOrderLists, { id })
  const [products] = useQuery(getProducts, { status: true })

  const getText = (key) => {
    switch (key) {
      case "PROCESS":
        return { label: "處理中", color: "#52c41a" }
      case "DELIVER":
        return { label: "送貨中", color: "#1890ff" }
      case "FINISH":
        return { label: "已結束", color: "#a3a3a3" }
      case "CANCEL":
        return { label: "已取消", color: "#f71212" }
      default:
        return { label: "未知", color: "#717171" }
    }
  }

  const modalColumns = [
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
      title: "單價",
      dataIndex: "perPrice",
      key: "perPrice",
      render: (_, rowData) => <div>$ {numberToCurrency(rowData?.price)}</div>,
    },
  ]

  const handleOnCheckDetail = async (record) => {
    const order = await invoke(getOrderList, { uuid: record?.uuid })
    if (order) {
      const shoplist = order?.shoplist
      const config = products?.reduce((a, v) => ({ ...a, [v.id]: v.name }), {})
      const refineShoplist = shoplist?.map((item) => {
        item.name = config?.[item.model]
        return item
      })
      Modal.info({
        title: "訂單詳細資訊",
        width: 1000,
        okText: "確認",
        maskClosable: true,
        centered: true,
        content: (
          <div>
            <div>
              <p>
                收件人: {order?.name} / {order?.phone}
              </p>
              <p>配送地址: {order?.address}</p>
            </div>
            <Table columns={modalColumns} dataSource={shoplist} pagination={false} />
            <div className="text-xl font-bold flex justify-start items-center mt-4 mx-4">
              <p>
                應付金額: TWD ${" "}
                {numberToCurrency(
                  refineShoplist?.reduce((acc, item) => acc + item.amount * item.price, 0)
                )}
              </p>
            </div>
          </div>
        ),
      })
    }
  }

  const columns = [
    {
      title: "訂單號碼",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "訂單日期",
      dataIndex: "createDate",
      key: "createDate",
      render: (text, value) => moment(value?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "應付金額",
      dataIndex: "price",
      key: "price",
      render: (_, rowData) => <div>$ {numberToCurrency(rowData?.price)}</div>,
    },
    {
      title: "訂單狀態",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        const x = getText(record?.status)
        return (
          <Space size="middle">
            <Tag color={x?.color}>{x?.label}</Tag>
          </Space>
        )
      },
    },
    {
      title: "",
      datatIndex: "action",
      key: "action",
      render: (text, record) => {
        return <Button onClick={() => handleOnCheckDetail(record)}>查閱</Button>
      },
    },
  ]

  return (
    <div>
      <Table columns={columns} dataSource={orderlists} pagination={false} scroll={{ x: "400px" }} />
    </div>
  )
}

export default Order
