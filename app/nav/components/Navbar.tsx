import React, { Suspense, useEffect, useState } from "react"
import Menu from "app/nav/components/Menu"
import NavBrand from "app/nav/components/NavBrand"
import Loading from "app/core/components/Loading"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { FaUserCircle, FaSearch } from "react-icons/fa"
import { Button, Input } from "antd"

import { useSelector } from "react-redux"
import { shoplistSelector } from "data/slice/shoplistSlice"

import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"

import isArray from "lodash/isArray"

import logout from "app/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"

import { signOut } from "next-auth/react"

const Navbar = () => {
  const [initShoplist, setInitShoplist] = useState([])

  const shoplist = useSelector(shoplistSelector.getShoplist)

  const [logoutMutation] = useMutation(logout)

  const router = useRouter()

  const handlePushToShoplist = () => {
    void router.push(Routes.CheckoutPage())
  }

  const handlePushToUserInfo = () => {
    void router.push(Routes.UserInfoPage())
  }

  const handleOnLogout = async () => {
    await signOut("line")
    const user = await logoutMutation()
  }

  useEffect(() => {
    const shopList = shoplist === "" ? JSON.parse(localStorage.getItem("cart")) : shoplist
    setInitShoplist(shopList)
  }, [shoplist])
  return (
    <div className="sticky top-0 z-10 min-h-[48px] bg-white flex items-center">
      <nav className="w-screen flex justify-between">
        <NavBrand />
        <Suspense fallback={<Loading />}>
          <Menu />
          <div className="hidden lg:flex justify-end items-center w-1/3">
            {/* <Input placeholder="搜尋商品" /> */}
            <div className="cart mx-4 flex justify-center items-center cursor-pointer lg:text-2xl 2xl:text-3xl relative">
              <div onClick={handlePushToShoplist}>
                <AiOutlineShoppingCart />
              </div>
              {isArray(initShoplist) && initShoplist.length > 0 && (
                <div className="absolute right-[-70%] top-[-50%] w-5 h-5 rounded-full text-sm">
                  {initShoplist.length}
                </div>
              )}
            </div>
            <div className="cursor-pointer lg:text-2xl 2xl:text-3xl mr-5">
              <div onClick={handlePushToUserInfo}>
                <FaUserCircle />
              </div>
            </div>
            <button onClick={handleOnLogout}>登出</button>
          </div>
        </Suspense>
      </nav>
    </div>
  )
}

export default Navbar
