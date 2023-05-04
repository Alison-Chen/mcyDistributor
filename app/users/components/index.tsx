import react, { useState, useEffect } from "react"
import { Tabs } from "antd"
import redux from "data/redux"
import { useRouter } from "next/router"
import { Routes } from "@blitzjs/next"
import { scooterListMock } from "app/configs/constant"
import getProducts from "app/scooters/queries/getProducts"
import UserInfoForm from "app/users/components/userInfo"
import Order from "app/users/components/order"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getUserInfo from "app/users/queries/getUserInfo"
import { useRedirectToNotReview } from "models/hooks/useRedirectToNotReview"

const UserInfo = () => {
  const [userInfo] = useQuery(getUserInfo)

  useRedirectToNotReview(userInfo)

  const items = [
    {
      label: "個人資訊",
      key: "1",
      children: <UserInfoForm userInfo={userInfo} />,
    },
    {
      label: "訂單",
      key: "3",
      children: <Order id={userInfo?.id} />,
    },
  ]

  return (
    <div className="flex justify-center items-start lg:m-10">
      <div className="w-2/3 mx-10">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  )
}

export default UserInfo
