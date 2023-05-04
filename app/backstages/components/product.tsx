import { BlitzPage } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import getAllProducts from "app/backstages/queries/getAllProducts"
import changeProductStatus from "app/backstages/mutations/changeProductStatus"

import { useRouter } from "next/router"

import moment from "moment"
import numberToCurrency from "app/utils/numberToCurrency"

import { useFormik, FormikProvider, FormikProps, Formik, Form } from "formik"
import { Formtasy, FormtasyConfig } from "formtasy"
import { whiteList } from "app/configs/whiteList"
import * as yup from "yup"

import { Table, Button, Modal, message, Input, Tabs, Image } from "antd"

const ProductPage: BlitzPage = () => {
  const [data, setData] = useState([])
  const [condition, setCondition] = useState({ status: true })
  const [isLoading, setIsLoading] = useState(false)

  const [changeProductStatusMutation] = useMutation(changeProductStatus)

  const formtasyConfig = { whiteList }

  const router = useRouter()

  const [modal, contextHolder] = Modal.useModal()

  useEffect(() => {
    const getProducts = async () => {
      const res = await invoke(getAllProducts, condition)

      const refineData = setData(res)
      console.log(res, "res")
    }
    void getProducts()
  }, [])

  const handleOnChangeTab = async (value) => {
    setIsLoading(true)
    const status = value === "LAUNCHED" ? true : false
    const res = await invoke(getAllProducts, { status })
    if (res) {
      setCondition({ status })
      setData(res)
      setIsLoading(false)
    }
  }

  const handleOnEdit = (id) => {
    void router.push(`/backstages/products/edit?id=${id}`)
  }

  const handleOnClick = () => {
    void router.push("/backstages/products/edit")
  }

  const handleOnchangeProductStatus = async (id) => {
    const content = condition?.status ? "是否將此商品下架？" : "是否將此商品重新上架？"
    const config = {
      content,
      title: "系統提醒",
      okText: "確認",
      cancelText: "取消",
      onOk: async () => {
        try {
          const result = await changeProductStatusMutation({ id, status: !condition?.status })
          const res = await invoke(getAllProducts, condition)
          setData(res)
        } catch (err) {
          return message.error("系統錯誤，請聯絡開發人員")
        }
      },
    }

    return modal.confirm(config)
  }

  const tabItems = [
    {
      label: "已上架",
      key: "LAUNCHED",
    },
    {
      label: "未上架",
      key: "UNLAUNCHED",
    },
  ]

  const columns = [
    {
      title: "商品名稱",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "商品顏色",
      dataIndex: "colors",
      key: "colors",
      render: (_, data) => data.color?.map((item, index) => <div key={index}>{item.label}</div>),
    },
    {
      title: "商品圖片",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (_, data) => <Image alt={data.name} src={data?.image} preview={false} width="100%" />,
    },
    {
      title: "商品價格",
      dataIndex: "price",
      key: "price",
      render: (_, data) => numberToCurrency(data?.price),
    },
    {
      title: "商品型號",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "剩餘數量",
      dataIndex: "amount",
      key: "amount",
      render: (_, data) => data?.color?.map((item, index) => <div key={index}>{item.amount}</div>),
    },
    {
      title: "功能",
      dataIndex: "action",
      key: "action",
      render: (_, data) => {
        return (
          <div className="space-x-2">
            {condition?.status && (
              <div className="flex justify-start items-center space-x-2">
                <Button type="primary" onClick={() => handleOnEdit(data?.id)}>
                  編輯
                </Button>
                <Button type="danger" onClick={() => handleOnchangeProductStatus(data?.id)}>
                  下架
                </Button>
              </div>
            )}
            {!condition?.status && (
              <Button type="danger" onClick={() => handleOnchangeProductStatus(data?.id)}>
                上架
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <p className="text-2xl">商品</p>
        <Button type="primary" onClick={handleOnClick}>
          新增商品
        </Button>
      </div>
      <Tabs defaultActiveKey="PROCESS" items={tabItems} onChange={handleOnChangeTab} />
      <Table columns={columns} dataSource={data} loading={isLoading} scroll={{ x: 1300 }} />
      {contextHolder}
    </div>
  )
}

export default ProductPage
