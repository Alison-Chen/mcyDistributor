import { BlitzPage } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import { whiteList } from "app/configs/whiteList"
import getUsers from "app/backstages/queries/getUsers"
import reviewUser from "app/backstages/mutations/reviewUser"
import cancelUser from "app/backstages/mutations/cancelUser"

import { Table, Button, Modal, message, Input, Tabs } from "antd"

const EditUserPage: BlitzPage = () => {
  const [data, setData] = useState([])
  const [condition, setCondition] = useState({})
  const [modal, contextHolder] = Modal.useModal()

  const [users, { setQueryData }] = useQuery(getUsers, { review: true, archived: false })
  const [reviewUserMutation] = useMutation(reviewUser)
  const [cancelUserMutation] = useMutation(cancelUser)

  useEffect(() => {
    setData(users)
  }, [])

  const handleOnReview = (data) => {
    const config = {
      title: "系統提醒",
      content: "是否將此會員通過審核？",
      okText: "確認",
      cancelText: "取消",
      onOk: async () => {
        try {
          const result = await reviewUserMutation({ id: data.id })
          const res = await invoke(getUsers, condition)
          setData(res)
        } catch (err) {
          return message.error("系統錯誤，請聯絡開發人員")
        }
      },
    }

    return modal.confirm(config)
  }

  const handleOnCancel = (data) => {
    const config = {
      title: "系統提醒",
      content: "確定要刪除此會員？",
      okText: "確認",
      cancelText: "取消",
      onOk: async () => {
        try {
          const result = await cancelUserMutation({ id: data?.id })
          const res = await invoke(getUsers, condition)
          setData(res)
        } catch (err) {
          return message.error("系統錯誤，請聯絡開發人員")
        }
      },
    }

    return modal.confirm(config)
  }

  const handleOnChangeTab = async (value) => {
    let tabCondition
    switch (value) {
      case "review":
        tabCondition = { review: true, archived: false }
        break
      case "notReview":
        tabCondition = { review: false, archived: false }
        break
      case "archived":
        tabCondition = { archived: true }
        break
    }

    const res = await invoke(getUsers, tabCondition)
    setCondition(tabCondition)
    setData(res)
  }

  const tabItems = [
    {
      label: "審核通過",
      key: "review",
    },
    {
      label: "尚未審核",
      key: "notReview",
    },
    {
      label: "封存",
      key: "archived",
    },
  ]

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "companyName",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "taxId",
      dataIndex: "taxId",
      key: "taxId",
    },
    {
      title: "功能",
      dataIndex: "action",
      key: "action",
      render: (_, data) => {
        console.log(data, "data")
        return (
          <div className="space-x-2">
            {!data?.review && (
              <Button type="primary" onClick={() => handleOnReview(data)}>
                審核
              </Button>
            )}
            {!data?.archived && (
              <Button type="primary" danger onClick={() => handleOnCancel(data)}>
                刪除
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="w-full">
      <p className="text-2xl">編輯會員</p>
      <Tabs defaultActiveKey="all" items={tabItems} onChange={handleOnChangeTab} />
      <Table columns={columns} dataSource={data} />
      {contextHolder}
    </div>
  )
}

export default EditUserPage
