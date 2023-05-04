import React from "react"
import { useRouter } from "next/router"
import { BrandName, routerName } from "app/configs/constant"
import { AiOutlineMenu } from "react-icons/ai"

const NavBrand = () => {
  const router = useRouter()

  const handleBrandClck = () => router.push("/")

  const handleRouterClick = () => router.push("/")

  return (
    <div className="flex justify-between items-center mx-2 w-full lg:w-1/3">
      <div className="flex items-center justify-evenly w-2/3 md:w-1/3 lg:w-full">
        <h1 className="cursor-pointer m-0" onClick={handleBrandClck}>
          {BrandName}
        </h1>
        <div>|</div>
        <div className="cursor-pointer" onClick={handleRouterClick}>
          {routerName}
        </div>
      </div>
      <div className="lg:hidden">
        <AiOutlineMenu />
      </div>
    </div>
  )
}

export default NavBrand
