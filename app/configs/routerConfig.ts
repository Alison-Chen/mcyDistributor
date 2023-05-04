export interface Route {
  label: string
  key: string
  icon?: string
  action?: string
  path?: string
  children?: Route[]
}

export const routers: Route[] = [
  {
    key: "template",
    children: [
      {
        label: "訂車",
        key: "orderScooter",
        path: "/scooter",
        src: "/section-1.jpeg",
      },
      {
        label: "訂零件",
        key: "orderGoods",
        path: "/goods",
        src: "/section-2.jpeg",
      },
    ],
  },
]

export const backstagesRouters: Route[] = [
  {
    key: "template",
    children: [
      {
        label: "後台首頁",
        key: "index",
        path: "/backstages",
      },
      {
        label: "編輯會員狀態",
        key: "editUser",
        path: "/backstages/editUser",
      },
      {
        label: "車款銷售狀況",
        key: "situation",
        path: "/backstages/situation",
      },
      {
        label: "商品訂單",
        key: "commodityOrder",
        path: "/backstages/commodityOrder",
      },
      {
        label: "商品",
        key: "products",
        path: "/backstages/products",
      },
      {
        label: "經銷商銷售狀況",
        key: "userSell",
        path: "/backstages/userSell",
      },
    ],
  },
]
