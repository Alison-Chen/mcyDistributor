import { useMutation, useQuery, invoke } from "@blitzjs/rpc"
import { useRouterQuery, Routes } from "@blitzjs/next"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { scooterListMock } from "app/configs/constant"
import { Image } from "antd"

import numberToCurrency from "app/utils/numberToCurrency"

import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import { useRedirectToNotReview } from "models/hooks/useRedirectToNotReview"
import { useRedirectToUserInfo } from "models/hooks/useRedirectToUserInfo"

import getProducts from "app/scooters/queries/getProducts"

const ScooterList = () => {
  const [products] = useQuery(getProducts, { status: true, type: "SCOOTER" })

  const router = useRouter()
  const user = useCurrentUser()

  useRedirectToNotReview(user)
  useRedirectToUserInfo(user)

  const handleOnClick = (id) => {
    void router.push(Routes.ScooterDetailPage({ id }))
  }

  return (
    <div className="my-10 container mx-auto max-w-[1080px]">
      <h2 className="text-3xl font-bold text-center mt-10 mb-14">選擇車款系列</h2>
      <ul className="flex flex-wrap lg:justify-start justify-center">
        {products.map((item) => (
          <li
            className="cursor-pointer w-2/3 md:w-1/3 lg:max-w-[23%] p-10 m-2"
            key={item.id}
            onClick={() => handleOnClick(item.id)}
          >
            <Image alt={item?.title} src={item?.image} preview={false} width="100%" />
            <div className="text-center text-xl">
              <p>{item?.name}</p>
              <p>{`NT$ ${numberToCurrency(item?.price)}`}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ScooterList
