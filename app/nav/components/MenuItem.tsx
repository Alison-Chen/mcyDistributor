import React, { ReactNode } from "react"
import { useState } from "react"
import { useRouter } from "next/router"

interface IProp {
  label: string
  leftIcon: ReactNode
  dropList?: ReactNode
  isActive?: boolean
  path?: string
}

const Menuitem: React.FC<IProp> = ({ leftIcon, label, dropList, path, isActive = false }) => {
  const [isOpen, setOpen] = useState(true)
  const router = useRouter()

  const openHandler = async () => {
    if (dropList) return
    if (path) await router.push(path)
  }

  return (
    <>
      <li
        className={
          "p-2" +
          (!dropList && "hover:text-primary cursor-pointer ") +
          (isActive ? " text-primary" : " text-gray-500")
        }
        onClick={openHandler}
      >
        <div className={"flex"}>
          <span>{label}</span>
        </div>
      </li>
      <div className={"overflow-hidden transition-all" + (isOpen ? "h-auto" : "h-0")}>
        <div className="flex w-full">{dropList}</div>
      </div>
    </>
  )
}

export default Menuitem
