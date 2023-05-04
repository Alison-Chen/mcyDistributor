import { MinusCircleOutlined, AiOutlinePlusCircle } from "@ant-design/icons"

export const schema = [
  {
    type: "Radio",
    properties: {
      label: "選擇車款系列",
      name: "model",
      id: "model",
      className:
        "!flex flex-col sticky lg:top-12 lg:left-0 text-center mb-4 w-full w-1/2:lg space-y-4",
      buttonStyle: "solid",
      optionType: "button",
    },
  },
  {
    type: "Image",
    properties: {
      preview: false,
      width: "100%",
      className: "text-center block w-full m-auto lg:w-full",
      name: "productImage",
      id: "productImage",
    },
  },
  {
    type: "Block",
    properties: {
      className: "w-full",
      fields: [
        {
          type: "Radio",
          properties: {
            label: "車款顏色",
            name: "color",
            id: "color",
            optionType: "button",
            buttonStyle: "solid",
            className: "!inline-grid grid-cols-3",
          },
        },
        {
          type: "NumberInput",
          properties: {
            label: "數量",
            name: "amount",
            id: "amount",
            min: 0,
          },
        },
        {
          type: "Radio",
          properties: {
            label: "電池",
            name: "battery",
            id: "battery",
            optionType: "button",
            buttonStyle: "solid",
            className: "!flex flex-col space-y-4",
          },
        },
        {
          type: "Radio",
          properties: {
            label: "充電器",
            name: "charger",
            id: "charger",
            optionType: "button",
            buttonStyle: "solid",
            className: "!flex flex-col space-y-4",
          },
        },
        {
          type: "Button",
          properties: {
            name: "submit",
            id: "submit",
            type: "primary",
            htmlType: "submit",
            text: "加入購物車",
          },
        },
      ],
    },
  },
]
