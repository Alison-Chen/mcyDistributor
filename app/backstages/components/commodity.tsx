import { BlitzPage } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import getCommodityOrder from "app/backstages/queries/getCommodities"
import addLogisticId from "app/backstages/mutations/addLogisticId"
import updateCommodityStatus from "app/backstages/mutations/updateCommodityStatus"
import { useRouter } from "next/router"

import moment from "moment"
import numberToCurrency from "app/utils/numberToCurrency"

import { useFormik, FormikProvider, FormikProps, Formik, Form } from "formik"
import { Formtasy, FormtasyConfig } from "formtasy"
import { whiteList } from "app/configs/whiteList"
import * as yup from "yup"

import { Table, Button, Modal, message, Input, Tabs, Select } from "antd"

const CommodityPage: BlitzPage = () => {
  const [data, setData] = useState([])
  const [isSubmit, setIsSubmit] = useState(false)
  const [delivery, setDelivery] = useState("")
  const [condition, setCondition] = useState({ status: "PROCESS" })
  const [logisticOrderId, setLogisticOrderId] = useState("")
  const [commodityOrder, setCommodityOrder] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formtasyConfig = { whiteList }

  const router = useRouter()

  const [addLogisticIdMutation] = useMutation(addLogisticId)
  const [updateCommodityStatusMutation] = useMutation(updateCommodityStatus)
  const [modal, contextHolder] = Modal.useModal()

  useEffect(() => {
    const getOrders = async () => {
      const res = await invoke(getCommodityOrder, condition)
      setData(res)
    }
    void getOrders()
  }, [])

  const handleOnChangeTab = async (value) => {
    setIsLoading(true)
    const res = await invoke(getCommodityOrder, { status: value })
    if (res) {
      setCondition({ status: value })
      setData(res)
      setIsLoading(false)
    }
  }

  const handleOnAddLogistic = async () => {
    setIsSubmit(true)
    if (logisticOrderId === "" && delivery !== "親送") return
    const res = await invoke(addLogisticIdMutation, {
      uuid: commodityOrder?.uuid,
      logisticOrderId: delivery === "親送" ? "親送" : logisticOrderId,
    })
    setIsSubmit(false)
    if (res) {
      const refetch = await invoke(getCommodityOrder, condition)
      setIsModalOpen(false)
      setData(refetch)
    }
  }

  const handleOnCancel = (data) => {
    modal.confirm({
      title: "系統提醒",
      content: "是否要取消此筆訂單，經更動後不可復原",
      onOk: async () => {
        const res = await invoke(updateCommodityStatusMutation, {
          uuid: data?.uuid,
          status: "CANCEL",
        })
        const refetch = await invoke(getCommodityOrder, condition)
        setData(refetch)
      },
    })
  }

  const handleOnEdit = (id) => {
    void router.push(`/backstages/commodityOrder/${id}?status=${condition.status}`)
  }

  const handleOnFinish = (data) => {
    modal.confirm({
      title: "系統提醒",
      content: "請確認此筆訂單已完成，經更動後不可復原",
      onOk: async () => {
        const res = await invoke(updateCommodityStatusMutation, {
          uuid: data?.uuid,
          status: "FINISH",
        })
        const refetch = await invoke(getCommodityOrder, condition)
        setData(refetch)
      },
    })
  }

  const tabItems = [
    {
      label: "處理中",
      key: "PROCESS",
    },
    {
      label: "運送中",
      key: "DELIVER",
    },
    {
      label: "已完成",
      key: "FINISH",
    },
    {
      label: "已取消",
      key: "CANCEL",
    },
  ]

  const columns = [
    {
      title: "商品訂單編號",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "物流訂單編號",
      dataIndex: "logisticOrderId",
      key: "logisticOrderId",
      width: 150,
      render: (_, rowData) => (rowData?.logisticOrderId ? rowData?.logisticOrderId : "-"),
    },
    {
      title: "公司名稱",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "收件人",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "總金額",
      dataIndex: "price",
      key: "price",
      render: (_, rowData) => numberToCurrency(rowData?.price),
    },
    {
      title: "訂單日期",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (_, rowData) => moment(rowData?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "電話號碼",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "統編",
      dataIndex: "taxId",
      key: "taxId",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "備註",
      dataIndex: "mark",
      key: "mark",
      width: 200,
    },
    {
      title: "功能",
      dataIndex: "action",
      key: "action",
      render: (_, data) => {
        return (
          <div className="space-x-2">
            {condition?.status === "PROCESS" && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen(true)
                    setDelivery("物流配送")
                    setLogisticOrderId("")
                    setCommodityOrder(data)
                  }}
                >
                  新增物流訂單編號
                </Button>
                <Button onClick={() => handleOnEdit(data?.uuid)}>編輯</Button>
                <Button type="danger" onClick={() => handleOnCancel(data)}>
                  取消訂單
                </Button>
              </div>
            )}
            {condition?.status === "DELIVER" && (
              <>
                <Button onClick={() => handleOnEdit(data?.uuid)}>編輯</Button>
                <Button type="primary" onClick={() => handleOnFinish(data)}>
                  完成訂單
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  const handleOnSubmit = async (values, { resetForm }) => {
    if (values?.uuid === "") delete values.uuid
    if (values?.companyName === "") delete values.companyName
    setIsLoading(true)
    const res = await invoke(getCommodityOrder, {
      ...values,
      ...condition,
    })
    if (res) {
      setIsLoading(false)
      setData(res)
      resetForm()
    }
  }

  const schema = [
    {
      type: "Block",
      properties: {
        className: "flex justify-center items-start",
        fields: [
          {
            type: "Input",
            properties: {
              name: "uuid",
              id: "uuid",
              placeholder: "請輸入訂單編號",
            },
          },
          {
            type: "Input",
            properties: {
              name: "companyName",
              id: "companyName",
              placeholder: "請輸入公司名稱",
            },
          },
          {
            type: "Button",
            properties: {
              text: "送出",
              htmlType: "submit",
              type: "primary",
            },
          },
        ],
      },
    },
  ]

  const validationSchema = yup.object().shape({
    uuid: yup.number().typeError("只能輸入數字"),
    companyName: yup
      .string()
      .test(
        "name",
        "請輸入半形中 / 英文",
        (value) => value?.match(/^[\u4e00-\u9fa5a-zA-Z]+$/) || !value
      ),
  })

  const formBlock = useFormik({
    enableReinitialize: true,
    initialValues: { uuid: "" },
    validationSchema,
    onSubmit: handleOnSubmit,
  })

  return (
    <div className="w-full">
      <p className="text-2xl">商品訂單</p>
      <FormikProvider value={formBlock}>
        <FormtasyConfig value={formtasyConfig}>
          <Form className="flex flex-col space-x-0 p-10 lg:space-x-10 lg:p-0 lg:flex-row justify-center items-center lg:items-start">
            <Formtasy schema={schema} />
          </Form>
        </FormtasyConfig>
      </FormikProvider>
      <Tabs defaultActiveKey="PROCESS" items={tabItems} onChange={handleOnChangeTab} />
      <Table columns={columns} dataSource={data} loading={isLoading} scroll={{ x: 2000 }} />
      {contextHolder}
      <Modal
        title="系統提醒"
        onOk={handleOnAddLogistic}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="space-y-2">
          <Select
            className="w-full"
            options={[
              { value: "親送", label: "親送" },
              { value: "物流配送", label: "物流配送" },
            ]}
            onChange={(e) => {
              setDelivery(e)
            }}
            value={delivery}
          />
          {delivery === "物流配送" && (
            <div>
              <Input
                required={true}
                placeholder="請輸入物流訂單編號"
                onChange={(e) => {
                  setLogisticOrderId(e.target.value)
                }}
              />
              {logisticOrderId === "" && isSubmit === true ? (
                <div className="text-[#c82a43]">請輸入物流訂單編號</div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default CommodityPage
