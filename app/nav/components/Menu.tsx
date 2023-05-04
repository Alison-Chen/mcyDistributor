import { routers } from "app/configs/routerConfig"
import Menuitem from "./MenuItem"
import { Button, Input } from "antd"
import logout from "app/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"

const Menu: React.FC = () => {
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  const isActive = (path?: string) => {
    return location.pathname === path
  }
  const handleLogout = async () => {
    await logoutMutation()
    void router.push(Routes.LoginPage())
  }
  return (
    <div className="hidden justify-between m-0 relative w-full lg:flex">
      <ul className="lg:flex w-full items-center justify-center lg:w-full">
        {routers &&
          routers.map((el) => (
            <Menuitem
              leftIcon={el.icon ? <i className={el.icon} /> : null}
              label={el.label}
              key={el.key}
              path={el.path}
              dropList={
                el.children && (
                  <>
                    {el.children?.map((el) => (
                      <div className="ml-4" key={el.key}>
                        <Menuitem
                          leftIcon={el.icon ? <i className={el.icon} /> : null}
                          label={el.label}
                          path={el.path}
                          isActive={isActive(el.path)}
                        />
                      </div>
                    ))}
                  </>
                )
              }
            />
          ))}
      </ul>
    </div>
  )
}

export default Menu
