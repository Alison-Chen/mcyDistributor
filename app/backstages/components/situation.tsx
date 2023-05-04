import { BlitzPage } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import { whiteList } from "app/configs/whiteList"
import getUsers from "app/backstages/queries/getUsers"
import reviewUser from "app/backstages/mutations/reviewUser"
import cancelUser from "app/backstages/mutations/cancelUser"
import getSituation from "app/backstages/queries/getSituation"
import isObject from "lodash/isObject"
import { generateHeaders } from "app/utils/generateExcelHeader"
import { saveWorkbook } from "app/utils/saveWorkbook"

import { Table, Button, Modal, message, Input, Tabs, Image } from "antd"

import * as ExcelJs from "exceljs"

const Situation: BlitzPage = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getOrders = async () => {
      const res = await invoke(getSituation)
      if (res) {
        console.log(res, "res")
        setData(res)
        setIsLoading(false)
      }
    }
    void getOrders()
  }, [])

  const handleOnExport = () => {
    const workbook = new ExcelJs.Workbook()
    // 添加sheet
    const worksheet = workbook.addWorksheet("美家園車款銷售資訊")
    // 设置 sheet 的默认行高
    worksheet.properties.defaultRowHeight = 20
    // 设置列
    worksheet.columns = generateHeaders(columns)
    // 添加行
    worksheet.addRows(data)
    // 导出excel
    saveWorkbook(workbook, "美家園車款銷售資訊.xlsx")
  }

  const columns = [
    {
      title: "商品名稱",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "商品圖片",
      dataIndex: "imgUrl",
      key: "imgUrl",
      width: 150,
      render: (_, rowData) => (
        <Image alt={rowData.name} src={rowData?.imgUrl} preview={false} width="100%" />
      ),
    },
    {
      title: "商品顏色",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "售出總量",
      dataIndex: "amount",
      key: "amount",
      render: (_, rowData) => (rowData?.amount ? rowData?.amount : "0"),
    },
    {
      title: "售出總額",
      dataIndex: "price",
      key: "price",
      render: (_, rowData) => (rowData?.price ? rowData?.price : "0"),
    },
  ]

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <p className="text-2xl">車款銷售狀況</p>
        <Button type="primary" onClick={handleOnExport}>
          導出 Excel
        </Button>
      </div>
      <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} loading={isLoading} />
    </div>
  )
}

export default Situation
